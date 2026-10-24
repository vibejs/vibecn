import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { isComponent, registry } from '../src/registry.ts';

mkdirSync('public/r', { recursive: true });
const notice = readFileSync('registry/vibecn.LICENSE', 'utf8');
const items = registry.map((item) => ({
  $schema: 'https://ui.shadcn.com/schema/registry-item.json',
  name: item.name,
  type: isComponent(item) ? 'registry:ui' : 'registry:lib',
  title: item.title,
  description: item.description,
  dependencies: item.dependencies,
  registryDependencies: item.registryDependencies,
  files: [
    ...item.files.map((file) => ({
      path: `registry/${file}`,
      type: file.startsWith('ui/') ? 'registry:ui' : 'registry:lib',
      target: file.startsWith('ui/') ? `components/ui/${file.slice(3)}` : `lib/${file.slice(4)}`,
      content: readFileSync(join('registry', file), 'utf8')
        .replaceAll('__VIBECN_UTILS__', '../../lib/utils.ts')
        .replaceAll('__VIBECN_LIB__', '../../lib'),
    })),
    {
      path: 'registry/vibecn.LICENSE',
      type: 'registry:file',
      target: 'vibecn.LICENSE',
      content: notice,
    },
  ],
}));
for (const item of items)
  writeFileSync(`public/r/${item.name}.json`, `${JSON.stringify(item, null, 2)}\n`);
writeFileSync(
  'public/r/registry.json',
  `${JSON.stringify({ $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'vibecn', homepage: 'https://vibejs.org', items }, null, 2)}\n`,
);
