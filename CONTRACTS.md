# vibecn contracts

## Distribution

- Components are .vibe source files, compiled by the consuming application's matching vibe.js compiler and runtime.
- The initial npm artifact is a source installer and registry, not a compiled component library.
- The CLI has no runtime npm dependencies and supports Node ^24.15.0 || >=26.
- The package is published as @usevibejs/vibecn on npm through npm trusted publishing with provenance.
- Built registry JSON follows shadcn's registry item schema; vibecn's CLI installs its bundled, trusted registry only. Remote registry installation and shadcn CLI compatibility are not promised.

## Installation

- vibecn init creates vibecn.json, a theme stylesheet and vibecn.LICENSE. Existing files are preserved unless --overwrite is explicit.
- vibecn add resolves local registry dependencies and copies source files, utility code and license notices. Byte-identical files are skipped.
- All paths are relative to the application root. Paths outside it and symlinked destinations are rejected before any files are written.
- --dry-run reports the same plan without writes. Conflicts are checked for the whole plan first. Unexpected I/O failures are reported; installation is not a filesystem transaction.
- The CLI never edits package.json, executes package managers, or edits existing CSS. It reports required dependencies and the theme import.
- Installed components need @usevibejs/ui, clsx and tailwind-merge, plus the application's vibe.js and Tailwind Vite plugins.

## Components

- Public props, events and slots use vibe.js public APIs. Native attributes and listeners reach the rendered element.
- class is merged with component defaults using clsx and tailwind-merge.
- Button renders a native button and defaults to type="button". asChild is not supported.
- Input and Textarea use a string v-model. Input supports text, email, password, search, tel and url; checkbox, radio and file inputs are outside this contract.
- Card parts are explicit imports. CardTitle is a heading; its heading level is h3 in this version.
- Checkbox, Switch, RadioGroupItem, NativeSelect and Slider thumbs are native form controls: keyboard, focus, form submission and validation come from the browser. Checkbox and Switch use boolean models, RadioGroup and NativeSelect string models, Slider a number array with one or two thumbs.
- Compound parts that share state, such as RadioGroup and Avatar, use provide/inject and must be nested in their parent.
- Calendar uses local Gregorian ISO dates, with a string/null model for single selection, `values` for multiple selection and `range` for inclusive ranges. Disabled dates remain focusable but cannot be selected or crossed by a range. Date Picker is a documented Popover composition.
- Carousel uses native scroll snapping, orientation-specific arrow keys and a zero-based `index` model. Chart renders a single numeric series as native SVG bar, line, area or pie graphics with an accessible data table; Recharts APIs are not supported.
- Sidebar uses independent desktop and mobile models, optional localStorage persistence, and the existing Sheet on mobile. Its menu parts are native lists, buttons and links. Data Table is a documented composition with application-owned state.
- Skeleton is decorative. Separator supports horizontal/vertical orientation and is decorative by default; :decorative="false" exposes separator semantics.
- Overlays build on the platform: Dialog, Alert Dialog, Sheet and Drawer on modal `<dialog>`; Popover, Tooltip and Hover Card on the `popover` attribute; Accordion on `<details name>`. Focus trapping, Escape, light dismiss and focus restoration come from the browser. `lib/overlay.ts` shares state between parts and positions floating content.
- Triggers, closes and actions render a Button and accept its variant and size. `asChild` is not supported.
- The supported browsers are those with the popover API and modal dialogs: Chrome and Edge 114, Safari 17 and Firefox 125 or later. Enter and exit animations use `@starting-style` and apply where it is supported.
- Chat components (Attachment, Bubble, Marker, Message, Message Scroller) are layout and styling; Message Scroller keeps the view at the newest content while the reader is at the end. The `shimmer` and `scroll-fade-*` utilities they use ship in the theme.
- Components follow the nearest `dir` attribute: horizontal arrow keys, submenu keys and floating placement mirror in right-to-left text. DirectionProvider sets the attribute for part of a page.
- v0.1 targets client rendering. Menus, selects, comboboxes and other composite widgets require a separate behavior and accessibility implementation before being advertised.

## Licensing

- The project uses MIT. Adapted files name their upstream source. THIRD-PARTY-NOTICES.md records the upstream revision and full MIT notice.
- Every installed source set includes vibecn.LICENSE with the project and upstream MIT texts.
- vibecn is independent of, and not endorsed by, shadcn/ui.
