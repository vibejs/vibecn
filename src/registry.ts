export interface RegistryItem {
  name: string;
  title: string;
  description: string;
  files: readonly string[];
  registryDependencies: readonly string[];
  dependencies: readonly string[];
}

const component = (
  name: string,
  title: string,
  description: string,
  files = [title],
): RegistryItem => ({
  name,
  title,
  description,
  files: files.map((file) => `ui/${file}.vibe`),
  registryDependencies: ['utils'],
  dependencies: [],
});

export const registry: readonly RegistryItem[] = [
  {
    name: 'utils',
    title: 'Class utilities',
    description: 'Conditional classes with Tailwind conflict resolution.',
    files: ['lib/utils.ts'],
    registryDependencies: [],
    dependencies: ['clsx', 'tailwind-merge'],
  },
  component('button', 'Button', 'A native button with six variants and four sizes.'),
  component('badge', 'Badge', 'A compact status label with four variants.'),
  component(
    'card',
    'Card',
    'A composable card with header, title, description, action, content and footer.',
    [
      'Card',
      'CardHeader',
      'CardTitle',
      'CardDescription',
      'CardAction',
      'CardContent',
      'CardFooter',
    ],
  ),
  component('input', 'Input', 'A text input with a string model and an exposed focus method.'),
  component('textarea', 'Textarea', 'A multiline text input with a string model.'),
  component('label', 'Label', 'A native label associated with a field by its for attribute.'),
  component('separator', 'Separator', 'A horizontal or vertical separator with a decorative mode.'),
  component(
    'skeleton',
    'Skeleton',
    'A decorative loading placeholder that respects reduced motion.',
  ),
];

export function resolveItems(names: readonly string[]): RegistryItem[] {
  const selected = new Map<string, RegistryItem>();
  const visit = (name: string): void => {
    if (selected.has(name)) return;
    const item = registry.find((candidate) => candidate.name === name);
    if (!item)
      throw new Error(
        `Unknown component "${name}". Run "vibecn list" to see available components.`,
      );
    for (const dependency of item.registryDependencies) visit(dependency);
    selected.set(name, item);
  };
  for (const name of names) visit(name);
  return [...selected.values()];
}
