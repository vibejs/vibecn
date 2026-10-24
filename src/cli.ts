import { readFileSync } from 'node:fs';
import { applyPlan, planAdd, planInit, type InstallPlan } from './install.ts';
import { isComponent, registry } from './registry.ts';

const { version } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as { version: string };

export const help = `vibecn — shadcn/ui components for vibe.js

Usage:
  vibecn init                      Create configuration, theme and license notices
  vibecn list                      List bundled components
  vibecn add button card           Copy components and their dependencies
  vibecn add --all                 Copy all bundled components

Options:
  --cwd <directory>                Application root (default: current directory)
  --dry-run                        Preview without writing
  --overwrite                      Replace files with different content
  --json                           Print machine-readable output
  --help                           Show help
  --version                        Show version

The CLI never installs npm dependencies or edits existing stylesheets.`;

export function run(
  args: readonly string[],
  cwd: string,
  output: (message: string) => void,
): number {
  let json = args.includes('--json');
  try {
    let root = cwd;
    let dryRun = false;
    let overwrite = false;
    let all = false;
    const positional: string[] = [];
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      if (arg === '--help' || arg === '-h') {
        output(help);
        return 0;
      }
      if (arg === '--version') {
        output(version);
        return 0;
      }
      if (arg === '--cwd') {
        const value = args[++index];
        if (!value || value.startsWith('-')) throw new Error('--cwd requires a directory.');
        root = value;
      } else if (arg === '--dry-run') dryRun = true;
      else if (arg === '--overwrite') overwrite = true;
      else if (arg === '--all') all = true;
      else if (arg === '--json') json = true;
      else if (arg.startsWith('-'))
        throw new Error(`Unknown option "${arg}". Run "vibecn --help".`);
      else positional.push(arg);
    }
    const [command, ...names] = positional;
    if (!command) {
      output(help);
      return 0;
    }
    if (command === 'list') {
      if (names.length || all || dryRun || overwrite)
        throw new Error('Usage: vibecn list [--json]');
      const components = registry.filter(isComponent);
      output(
        json
          ? JSON.stringify({ ok: true, components })
          : components.map((item) => `${item.name.padEnd(12)} ${item.description}`).join('\n'),
      );
      return 0;
    }
    let plan: InstallPlan;
    if (command === 'init') {
      if (names.length || all) throw new Error('Usage: vibecn init [--dry-run] [--overwrite]');
      plan = planInit(root, overwrite);
    } else if (command === 'add') {
      if ((!names.length && !all) || (names.length && all))
        throw new Error('Usage: vibecn add <component...> or vibecn add --all');
      plan = planAdd(root, all ? registry.map((item) => item.name) : names, overwrite);
    } else throw new Error(`Unknown command "${command}". Run "vibecn --help".`);
    if (!dryRun) applyPlan(plan);
    const files = plan.files.map(({ path, action }) => ({ path, action }));
    const next =
      command === 'init'
        ? [
            'Import the generated theme stylesheet after your Tailwind import.',
            'Install clsx and tailwind-merge with your package manager.',
            'Run vibecn add button card.',
          ]
        : [
            'Import components directly from their generated .vibe files.',
            `Required npm dependencies: ${plan.dependencies.join(', ')}.`,
          ];
    output(
      json
        ? JSON.stringify({
            ok: true,
            command,
            dryRun,
            files,
            dependencies: plan.dependencies,
            next,
          })
        : [
            dryRun ? 'Dry run. No files written.' : 'Source files ready.',
            ...files.map((file) => `${file.action.padEnd(10)} ${file.path}`),
            '',
            ...next,
          ].join('\n'),
    );
    return 0;
  } catch (error) {
    const message = String(error).replace(/^Error: /, '');
    output(json ? JSON.stringify({ ok: false, error: message }) : `Error: ${message}`);
    return 1;
  }
}
