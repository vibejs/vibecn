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
- Skeleton is decorative. Separator supports horizontal/vertical orientation and is decorative by default; :decorative="false" exposes separator semantics.
- v0.1 targets client rendering. Dialog, menus, selects and other composite widgets require a separate behavior and accessibility implementation before being advertised.

## Licensing

- The project uses MIT. Adapted files name their upstream source. THIRD-PARTY-NOTICES.md records the upstream revision and full MIT notice.
- Every installed source set includes vibecn.LICENSE with the project and upstream MIT texts.
- vibecn is independent of, and not endorsed by, shadcn/ui.
