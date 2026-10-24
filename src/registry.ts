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
  registryDependencies: string[] = [],
): RegistryItem => ({
  name,
  title,
  description,
  files: files.map((file) => `ui/${file}.vibe`),
  registryDependencies: ['utils', ...registryDependencies],
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
  {
    name: 'collection',
    title: 'Collection utilities',
    description: 'Keyboard navigation and typeahead for groups of items.',
    files: ['lib/collection.ts'],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'toast',
    title: 'Toast store',
    description: 'The toast() function and the list of toasts that Sonner renders.',
    files: ['lib/toast.ts'],
    registryDependencies: [],
    dependencies: [],
  },
  {
    name: 'overlay',
    title: 'Overlay utilities',
    description: 'Shared state, modal and positioning helpers for dialogs, popovers and tooltips.',
    files: ['lib/overlay.ts'],
    registryDependencies: [],
    dependencies: [],
  },
  component('accordion', 'Accordion', 'A vertically stacked set of disclosures built on details.', [
    'Accordion',
    'AccordionItem',
    'AccordionTrigger',
    'AccordionContent',
  ]),
  component('alert', 'Alert', 'A callout for important information, with an optional icon.', [
    'Alert',
    'AlertTitle',
    'AlertDescription',
  ]),
  component('aspect-ratio', 'Aspect Ratio', 'Displays content within a desired ratio.', [
    'AspectRatio',
  ]),
  component('avatar', 'Avatar', 'An image element with a fallback for representing the user.', [
    'Avatar',
    'AvatarImage',
    'AvatarFallback',
    'AvatarBadge',
    'AvatarGroup',
    'AvatarGroupCount',
  ]),
  component(
    'breadcrumb',
    'Breadcrumb',
    'Displays the path to the current page using a hierarchy of links.',
    [
      'Breadcrumb',
      'BreadcrumbList',
      'BreadcrumbItem',
      'BreadcrumbLink',
      'BreadcrumbPage',
      'BreadcrumbSeparator',
      'BreadcrumbEllipsis',
    ],
  ),
  component(
    'button-group',
    'Button Group',
    'A container that groups related buttons together with consistent styling.',
    ['ButtonGroup', 'ButtonGroupText', 'ButtonGroupSeparator'],
    ['separator'],
  ),
  component('checkbox', 'Checkbox', 'A native checkbox with checked and indeterminate states.'),
  component('empty', 'Empty', 'Displays an empty state with an icon, a message and actions.', [
    'Empty',
    'EmptyHeader',
    'EmptyMedia',
    'EmptyTitle',
    'EmptyDescription',
    'EmptyContent',
  ]),
  component(
    'field',
    'Field',
    'Combines labels, controls and help text to compose accessible form fields.',
    [
      'Field',
      'FieldSet',
      'FieldLegend',
      'FieldGroup',
      'FieldContent',
      'FieldLabel',
      'FieldTitle',
      'FieldDescription',
      'FieldSeparator',
      'FieldError',
    ],
    ['label', 'separator'],
  ),
  component(
    'input-group',
    'Input Group',
    'Adds icons, text and buttons to inputs and textareas.',
    [
      'InputGroup',
      'InputGroupAddon',
      'InputGroupButton',
      'InputGroupText',
      'InputGroupInput',
      'InputGroupTextarea',
    ],
    ['button', 'input', 'textarea'],
  ),
  component(
    'item',
    'Item',
    'A versatile flex container for displaying content with media, text and actions.',
    [
      'Item',
      'ItemGroup',
      'ItemSeparator',
      'ItemMedia',
      'ItemContent',
      'ItemTitle',
      'ItemDescription',
      'ItemActions',
      'ItemHeader',
      'ItemFooter',
    ],
    ['separator'],
  ),
  component('kbd', 'Kbd', 'Displays a keyboard key or shortcut.', ['Kbd', 'KbdGroup']),
  component(
    'native-select',
    'Native Select',
    'A styled native select element with a string model.',
    ['NativeSelect', 'NativeSelectOption', 'NativeSelectOptGroup'],
  ),
  component(
    'pagination',
    'Pagination',
    'Pagination with page navigation, next and previous links.',
    [
      'Pagination',
      'PaginationContent',
      'PaginationItem',
      'PaginationLink',
      'PaginationPrevious',
      'PaginationNext',
      'PaginationEllipsis',
    ],
  ),
  component(
    'progress',
    'Progress',
    'Displays an indicator showing the completion progress of a task.',
  ),
  component(
    'radio-group',
    'Radio Group',
    'A set of native radio buttons where one can be checked.',
    ['RadioGroup', 'RadioGroupItem'],
  ),
  component('slider', 'Slider', 'A native range input with one thumb, or two for a range.'),
  component('spinner', 'Spinner', 'An indicator that shows a loading state.'),
  component('switch', 'Switch', 'A native checkbox styled as a switch.'),
  component('table', 'Table', 'A responsive table component.', [
    'Table',
    'TableHeader',
    'TableBody',
    'TableFooter',
    'TableRow',
    'TableHead',
    'TableCell',
    'TableCaption',
  ]),
  component('toggle', 'Toggle', 'A two-state button that can be either on or off.'),
  component(
    'alert-dialog',
    'Alert Dialog',
    'A modal dialog that interrupts the user with important content and expects a response.',
    [
      'AlertDialog',
      'AlertDialogTrigger',
      'AlertDialogContent',
      'AlertDialogHeader',
      'AlertDialogFooter',
      'AlertDialogTitle',
      'AlertDialogDescription',
      'AlertDialogMedia',
      'AlertDialogAction',
      'AlertDialogCancel',
    ],
    ['overlay', 'dialog', 'button'],
  ),
  component(
    'collapsible',
    'Collapsible',
    'An interactive component which expands and collapses a panel.',
    ['Collapsible', 'CollapsibleTrigger', 'CollapsibleContent'],
    ['overlay', 'button'],
  ),
  component(
    'dialog',
    'Dialog',
    'A window overlaid on the primary window, built on the native dialog element.',
    [
      'Dialog',
      'DialogTrigger',
      'DialogContent',
      'DialogHeader',
      'DialogFooter',
      'DialogTitle',
      'DialogDescription',
      'DialogClose',
    ],
    ['overlay', 'button'],
  ),
  component(
    'drawer',
    'Drawer',
    'A panel that slides in from an edge of the screen and can be dragged closed.',
    [
      'Drawer',
      'DrawerTrigger',
      'DrawerContent',
      'DrawerHeader',
      'DrawerFooter',
      'DrawerTitle',
      'DrawerDescription',
      'DrawerClose',
    ],
    ['overlay', 'button'],
  ),
  component(
    'hover-card',
    'Hover Card',
    'For sighted users to preview content available behind a link.',
    ['HoverCard', 'HoverCardTrigger', 'HoverCardContent'],
    ['overlay'],
  ),
  component(
    'popover',
    'Popover',
    'Displays rich content in a portal, triggered by a button.',
    [
      'Popover',
      'PopoverTrigger',
      'PopoverAnchor',
      'PopoverContent',
      'PopoverHeader',
      'PopoverTitle',
      'PopoverDescription',
    ],
    ['overlay', 'button'],
  ),
  component(
    'sheet',
    'Sheet',
    'Extends the Dialog component to display content that complements the main content.',
    [
      'Sheet',
      'SheetTrigger',
      'SheetContent',
      'SheetHeader',
      'SheetFooter',
      'SheetTitle',
      'SheetDescription',
      'SheetClose',
    ],
    ['overlay', 'button'],
  ),
  component(
    'tooltip',
    'Tooltip',
    'A popup that displays information related to an element on hover or keyboard focus.',
    ['Tooltip', 'TooltipTrigger', 'TooltipContent'],
    ['overlay', 'button'],
  ),
  component(
    'input-otp',
    'Input OTP',
    'Accessible one-time password input with copy paste and autofill.',
    ['InputOTP', 'InputOTPGroup', 'InputOTPSlot', 'InputOTPSeparator'],
  ),
  component('resizable', 'Resizable', 'Resizable panel groups and layouts with keyboard support.', [
    'ResizablePanelGroup',
    'ResizablePanel',
    'ResizableHandle',
  ]),
  component('scroll-area', 'Scroll Area', 'A scrollable region with slim, themed scrollbars.', [
    'ScrollArea',
    'ScrollBar',
  ]),
  component('sonner', 'Sonner', 'An opinionated toast component.', ['Toaster'], ['toast']),
  component(
    'tabs',
    'Tabs',
    'A set of layered sections of content, known as tab panels, displayed one at a time.',
    ['Tabs', 'TabsList', 'TabsTrigger', 'TabsContent'],
    ['collection'],
  ),
  component(
    'toggle-group',
    'Toggle Group',
    'A set of two-state buttons that can be toggled on or off.',
    ['ToggleGroup', 'ToggleGroupItem'],
    ['collection', 'toggle'],
  ),
];

/** Library items, such as the class utility, are installed as dependencies but not listed. */
export const isComponent = (item: RegistryItem): boolean =>
  item.files.some((file) => file.startsWith('ui/'));

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
