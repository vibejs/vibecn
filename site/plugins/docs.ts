import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';
import { Marked, type Tokens } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';
import type { Plugin } from 'vite';
import type { Block, Frontmatter } from '../src/site/types.ts';
import { registry, resolveItems } from '../../src/registry.ts';

const languages = ['vue', 'ts', 'bash', 'css', 'json', 'html'];
const extensions: Record<string, string> = { '.vibe': 'vue', '.ts': 'ts', '.css': 'css' };
let highlighter: Promise<Highlighter> | undefined;

export async function highlight(code: string, lang: string): Promise<string> {
  highlighter ??= createHighlighter({
    themes: ['github-light-default', 'github-dark-default'],
    langs: languages,
  });
  return (await highlighter).codeToHtml(code.trimEnd(), {
    lang: lang === 'sh' || lang === 'shell' ? 'bash' : lang === 'vibe' ? 'vue' : lang,
    themes: { light: 'github-light-default', dark: 'github-dark-default' },
    defaultColor: false,
  });
}

export function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function frontmatter(source: string, file: string): { data: Frontmatter; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(source);
  if (!match) throw new Error(`${file} needs frontmatter with a title and a description.`);
  const data: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator > 0) data[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  if (!data.title || !data.description)
    throw new Error(`${file} needs frontmatter with a title and a description.`);
  return { data: data as Frontmatter, body: source.slice(match[0].length) };
}

export interface DocsOptions {
  /** The site's source directory, holding content/ and examples/. */
  src: string;
  /** The registry directory with the .vibe sources. */
  registry: string;
}

export function docs(options: DocsOptions): Plugin {
  const content = join(options.src, 'content');
  const examples = join(options.src, 'examples');

  async function render(markdown: string, toc: { depth: number; text: string; id: string }[]) {
    const marked = new Marked({
      renderer: {
        heading({ tokens, depth }) {
          const text = this.parser.parseInline(tokens);
          const id = slug(text);
          if (depth === 2 || depth === 3)
            toc.push({ depth, text: text.replace(/<[^>]+>/g, ''), id });
          return `<h${depth} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${text}</h${depth}>\n`;
        },
      },
    });
    const tokens = marked.lexer(markdown);
    const pending: Promise<void>[] = [];
    marked.walkTokens(tokens, (token) => {
      if (token.type !== 'code') return;
      const code = token as Tokens.Code;
      pending.push(
        highlight(code.text, code.lang || 'text').then((html) => {
          Object.assign(token, {
            type: 'html',
            block: true,
            text: `<div class="code-block">${html}<button type="button" class="copy-button" data-copy="${encodeURIComponent(code.text)}" aria-label="Copy code">Copy</button></div>`,
          });
        }),
      );
    });
    await Promise.all(pending);
    return marked
      .parser(tokens)
      .replaceAll('<table>', '<div class="table-wrapper"><table>')
      .replaceAll('</table>', '</table></div>');
  }

  async function example(name: string, file: string) {
    const path = join(examples, `${name}.vibe`);
    if (!existsSync(path)) throw new Error(`${file} uses a missing example "${name}".`);
    const code = readFileSync(path, 'utf8');
    return { path, code, html: await highlight(code, 'vue') };
  }

  async function installation(name: string, file: string) {
    if (!registry.some((entry) => entry.name === name))
      throw new Error(`${file} installs a missing registry item "${name}".`);
    const items = resolveItems([name]);
    const sources = items.flatMap((item) => item.files);
    const files = await Promise.all(
      sources.map(async (path) => {
        const code = readFileSync(join(options.registry, path), 'utf8').replaceAll(
          '__VIBECN_UTILS__',
          '../../lib/utils.ts',
        );
        const target = path.startsWith('ui/') ? `components/${path}` : path;
        return { path: target, code, html: await highlight(code, extensions[extname(path)]) };
      }),
    );
    const dependencies = [...new Set(items.flatMap((item) => item.dependencies))];
    return { files, dependencies, sources: sources.map((path) => join(options.registry, path)) };
  }

  async function compile(file: string, watch: (path: string) => void) {
    const { data, body } = frontmatter(readFileSync(file, 'utf8'), file);
    const toc: { depth: number; text: string; id: string }[] = [];
    const blocks: Block[] = [];
    const directive = /^<(Example|Installation)((?:\s+[a-z]+="[^"]*")*)\s*\/>\s*$/gm;
    let last = 0;
    for (const match of body.matchAll(directive)) {
      const before = body.slice(last, match.index);
      if (before.trim()) blocks.push({ type: 'html', html: await render(before, toc) });
      last = match.index + match[0].length;
      const attrs = Object.fromEntries(
        [...match[2].matchAll(/([a-z]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]),
      );
      if (match[1] === 'Example') {
        const result = await example(attrs.name, file);
        watch(result.path);
        blocks.push({
          type: 'example',
          name: attrs.name,
          html: result.html,
          code: result.code,
          align: attrs.align,
        });
      } else {
        const name = attrs.name ?? basename(file, '.md');
        const result = await installation(name, file);
        result.sources.forEach(watch);
        blocks.push({
          type: 'installation',
          name,
          command: `add ${name}`,
          dependencies: result.dependencies,
          files: result.files,
        });
      }
    }
    const rest = body.slice(last);
    if (rest.trim()) blocks.push({ type: 'html', html: await render(rest, toc) });
    return { frontmatter: data, toc, blocks };
  }

  function index() {
    const pages: { path: string; frontmatter: Frontmatter }[] = [];
    const walk = (directory: string) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (entry.name.endsWith('.md'))
          pages.push({
            path: relative(content, path).replace(/\.md$/, '').split('\\').join('/'),
            frontmatter: frontmatter(readFileSync(path, 'utf8'), path).data,
          });
      }
    };
    walk(content);
    return pages;
  }

  return {
    name: 'vibecn-docs',
    resolveId(id) {
      if (id === 'virtual:docs-index') return '\0virtual:docs-index';
    },
    load(id) {
      if (id === '\0virtual:docs-index') {
        return `export default ${JSON.stringify(index())};`;
      }
    },
    async transform(_code, id) {
      if (!id.endsWith('.md') || !id.startsWith(content)) return;
      const page = await compile(id, (path) => this.addWatchFile(path));
      return { code: `export default ${JSON.stringify(page)};`, map: null };
    },
    configureServer(server) {
      // The index reads every page's frontmatter: refresh it when a page is added, changed or removed.
      const refresh = (file: string) => {
        if (!file.startsWith(content)) return;
        const module = server.moduleGraph.getModuleById('\0virtual:docs-index');
        if (module) server.reloadModule(module);
      };
      server.watcher.on('add', refresh).on('change', refresh).on('unlink', refresh);
    },
  };
}
