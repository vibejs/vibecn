import { lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveItems } from './registry.ts';

export interface Config {
  version: 1;
  paths: { components: string; lib: string; styles: string };
}

export interface PlannedFile {
  path: string;
  content: string;
  action: 'create' | 'overwrite' | 'skip';
}

export interface InstallPlan {
  root: string;
  overwrite: boolean;
  files: PlannedFile[];
  dependencies: string[];
}

const assets = fileURLToPath(new URL('../registry/', import.meta.url));
const asset = (path: string): string => readFileSync(join(assets, path), 'utf8');

/** Resolve inside the real application root, rejecting links including dangling links. */
export function destination(root: string, path: string): string {
  if (
    isAbsolute(path) ||
    /[\\:\0]/.test(path) ||
    path.split('/').some((part) => !part || part === '.' || part === '..')
  ) {
    throw new Error(`Invalid destination "${path}". Use a relative path inside the application.`);
  }
  let current = root;
  const parts = path.split('/');
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const stat = lstatSync(current, { throwIfNoEntry: false });
    if (stat?.isSymbolicLink()) throw new Error(`Refusing symlink destination "${path}".`);
    if (stat && index < parts.length - 1 && !stat.isDirectory()) {
      throw new Error(
        `Invalid destination "${path}". A parent must be a directory and a target must be a regular file.`,
      );
    }
  }
  return current;
}

function validateConfig(value: unknown): Config {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('version' in value) ||
    value.version !== 1 ||
    !('paths' in value)
  ) {
    throw new Error(
      'Invalid vibecn.json. Expected version 1 and paths.components, paths.lib and paths.styles.',
    );
  }
  const paths = value.paths;
  if (
    typeof paths !== 'object' ||
    paths === null ||
    !('components' in paths) ||
    typeof paths.components !== 'string' ||
    !('lib' in paths) ||
    typeof paths.lib !== 'string' ||
    !('styles' in paths) ||
    typeof paths.styles !== 'string'
  ) {
    throw new Error(
      'Invalid vibecn.json. Expected version 1 and paths.components, paths.lib and paths.styles.',
    );
  }
  if (!paths.styles.endsWith('.css')) throw new Error('The theme destination must end in .css.');
  return {
    version: 1,
    paths: { components: paths.components, lib: paths.lib, styles: paths.styles },
  };
}

export function readConfig(root: string): Config {
  const file = destination(root, 'vibecn.json');
  if (!lstatSync(file, { throwIfNoEntry: false }))
    throw new Error('No vibecn.json found. Run "vibecn init" in your application first.');
  const config = validateConfig(JSON.parse(readFileSync(file, 'utf8')));
  for (const path of Object.values(config.paths)) destination(root, path);
  return config;
}

function plan(
  root: string,
  entries: { path: string; content: string }[],
  overwrite: boolean,
  dependencies: string[],
): InstallPlan {
  const unique = new Set<string>();
  const files = entries.map(({ path, content }): PlannedFile => {
    if (unique.has(path))
      throw new Error(
        `Multiple registry files target "${path}". Choose distinct component, utility and stylesheet paths.`,
      );
    unique.add(path);
    const file = destination(root, path);
    const stat = lstatSync(file, { throwIfNoEntry: false });
    if (stat && !stat.isFile()) throw new Error(`Destination "${path}" must be a regular file.`);
    if (!stat) return { path, content, action: 'create' };
    if (readFileSync(file, 'utf8') === content) return { path, content, action: 'skip' };
    if (!overwrite)
      throw new Error(
        `File "${path}" already exists with different content. Review it before using --overwrite.`,
      );
    return { path, content, action: 'overwrite' };
  });
  for (const file of files) {
    if (files.some((other) => other.path.startsWith(`${file.path}/`)))
      throw new Error(`Destination "${file.path}" is also used as a parent directory.`);
  }
  return { root, overwrite, files, dependencies };
}

export function planInit(cwd: string, overwrite = false): InstallPlan {
  const root = realpathSync(cwd);
  const manifest = JSON.parse(readFileSync(destination(root, 'package.json'), 'utf8'));
  if (!manifest.dependencies?.['@usevibejs/ui'] && !manifest.devDependencies?.['@usevibejs/ui']) {
    throw new Error(
      'This application must declare @usevibejs/ui in package.json before initializing vibecn.',
    );
  }
  const prefix = lstatSync(destination(root, 'ui'), { throwIfNoEntry: false })?.isDirectory()
    ? 'ui/src'
    : 'src';
  const config: Config = {
    version: 1,
    paths: {
      components: `${prefix}/components/ui`,
      lib: `${prefix}/lib`,
      styles: `${prefix}/vibecn.css`,
    },
  };
  return plan(
    root,
    [
      { path: 'vibecn.json', content: `${JSON.stringify(config, null, 2)}\n` },
      { path: config.paths.styles, content: asset('styles/theme.css') },
      { path: 'vibecn.LICENSE', content: asset('vibecn.LICENSE') },
    ],
    overwrite,
    [],
  );
}

export function planAdd(cwd: string, names: readonly string[], overwrite = false): InstallPlan {
  const root = realpathSync(cwd);
  const config = readConfig(root);
  const items = resolveItems(names);
  const entries = items.flatMap((item) =>
    item.files.map((file) => {
      const isComponent = file.startsWith('ui/');
      const path = join(
        isComponent ? config.paths.components : config.paths.lib,
        file.slice(file.indexOf('/') + 1),
      )
        .split(sep)
        .join('/');
      const utility = relative(
        dirname(resolve(root, path)),
        resolve(root, config.paths.lib, 'utils.ts'),
      )
        .split(sep)
        .join('/');
      return {
        path,
        content: asset(file).replaceAll(
          '__VIBECN_UTILS__',
          utility.startsWith('.') ? utility : `./${utility}`,
        ),
      };
    }),
  );
  entries.push({ path: 'vibecn.LICENSE', content: asset('vibecn.LICENSE') });
  return plan(root, entries, overwrite, [...new Set(items.flatMap((item) => item.dependencies))]);
}

export function applyPlan(input: InstallPlan): void {
  // Recheck the complete plan, including conflicts that appeared after a dry run.
  const checked = plan(input.root, input.files, input.overwrite, input.dependencies);
  for (const file of checked.files) {
    if (file.action === 'skip') continue;
    const path = destination(checked.root, file.path);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, file.content, { flag: file.action === 'create' ? 'wx' : 'w' });
  }
}
