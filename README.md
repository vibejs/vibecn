# vibecn

An independent port of [shadcn/ui](https://ui.shadcn.com) components for [vibe.js](https://vibejs.org).

The CLI copies `.vibe` component source into your application. You own the files and compile them with your application's vibe.js compiler. No React runtime or compiled component package is required.

**Preview.** Published on npm as `@usevibejs/vibecn`. This project is not affiliated with or endorsed by shadcn/ui.

## Try the playground

The playground is live at https://vibecn.monsterorigin.workers.dev. To run it locally:

Use Node `^24.15.0 || >=26` and pnpm 12.14.0.

```sh
pnpm install
pnpm dev
```

The playground uses components installed by the same CLI as a consumer app. It includes a live form, all button and badge variants, class overrides, light/dark themes and accent colors. It does not send form data to a server.

## Add components to a vibe.js application

From your application's root:

```sh
pnpm dlx @usevibejs/vibecn init
pnpm dlx @usevibejs/vibecn list
pnpm dlx @usevibejs/vibecn add button card input label textarea
```

`npx @usevibejs/vibecn` works the same way. You can also pass `--cwd <application-directory>` from another directory.

Install the shared utility dependencies with your application's package manager. In a catalog-managed workspace, add their versions to your catalog and use `catalog:` in the app manifest.

```sh
pnpm add clsx tailwind-merge
```

The application needs matching `@usevibejs/ui` and `@usevibejs/compiler` versions, the vibe.js Vite plugin, and Tailwind CSS v4 with its Vite plugin. `init` checks for a declared `@usevibejs/ui` dependency; it does not install or configure these tools.

Import the generated theme after Tailwind in your application's main stylesheet:

```css
@import 'tailwindcss';
@import './vibecn.css';
```

Then import components directly. In a `.vibe` file:

```html
<script setup lang="ts">
  import { ref } from '@usevibejs/ui';
  import Button from './components/ui/Button.vibe';
  import Input from './components/ui/Input.vibe';
  import Label from './components/ui/Label.vibe';

  const name = ref('');
  const saved = ref(false);
</script>

<template>
  <form @submit.prevent="saved = true">
    <label for="name">Name</label>
    <input id="name" v-model="name" autocomplete="name" required />
    <button type="submit">Save changes</button>
    <p v-if="saved" role="status">Saved locally for {{ name }}.</p>
  </form>
</template>
```

For a full-stack app with a `ui` directory, paths start at `ui/src`. For a standalone app they start at `src`. Review `vibecn.json` after initialization to choose other component and utility directories. If you change the stylesheet path, move the generated stylesheet too. Paths must remain inside the application and cannot pass through symlinks.

The theme uses `:root` defaults and a `.dark` ancestor. It adds no CSS reset beyond the application's existing Tailwind setup. Review token names if your application already has a theme. Tailwind must scan the generated component sources; add an explicit `@source` if your application restricts source detection.

## CLI

```sh
vibecn init --dry-run
vibecn add button card --dry-run --json
vibecn add --all
vibecn add button --overwrite
```

These short commands assume the CLI is installed, for example as a dev dependency. Otherwise prefix them with `pnpm dlx @usevibejs/vibecn`.

- `init` writes configuration, theme tokens and full license notices.
- `list` shows the eight available component groups.
- `add` copies selected components, their shared utility, and license notices. It never fetches remote registry code.
- `--dry-run` checks conflicts and reports the plan without writes.
- Existing identical files are skipped. Different contents require an explicit `--overwrite`; review your customizations first.
- `init`, `list` and `add` accept `--json` to produce one JSON result. Success exits 0; usage or installation failures exit 1.

The CLI does not edit existing stylesheets, change dependency manifests, or execute package managers. It checks the entire plan before writes, and rechecks before applying. An unexpected filesystem failure can still leave a partial installation; it is not a transactional filesystem.

## Components

| Group     | API                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button    | `variant`: default, secondary, destructive, outline, ghost, link. `size`: default, sm, lg, icon. Defaults to `type="button"`; set `type="submit"` for forms.                               |
| Badge     | `variant`: default, secondary, destructive, outline.                                                                                                                                       |
| Card      | Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter. Each is a separate import. CardTitle renders an `h3`.                                                   |
| Input     | String `v-model`; text, email, password, search, tel and url types; native attributes; exposed `focus()`.                                                                                  |
| Textarea  | String `v-model`; rows and native constraints; exposed `focus()`.                                                                                                                          |
| Label     | Native label with `for`.                                                                                                                                                                   |
| Separator | `orientation`: horizontal or vertical. Decorative by default, like shadcn/ui; set `:decorative="false"` for a semantic separator. Vertical separators need a parent with a defined height. |
| Skeleton  | Decorative placeholder, hidden from assistive technology. Animation respects reduced motion.                                                                                               |

Components forward native attributes and event listeners. `class` accepts strings, arrays and conditional objects; conflicting Tailwind utilities are merged with consumer classes last. Button and Badge do not support React/Radix `asChild`. `CardAction` can be positioned by adding `grid-cols-[1fr_auto]` to its CardHeader.

## Registry and packaging

`pnpm build` produces:

- `dist/`: the Node CLI and installer API, with TypeScript declarations.
- `public/r/`: registry JSON with embedded source and license notices.
- `playground/dist/`: the static playground, including `/r/` payloads. `npx wrangler deploy` publishes it as the `vibecn` Cloudflare Worker configured in `wrangler.jsonc`.

The registry payloads use shadcn's registry schema. The bundled CLI is the supported installer; compatibility with shadcn's CLI or arbitrary remote registries has not been established.

The npm artifact contains the CLI, source registry and license texts. Releases are versioned with changesets and published by `.github/workflows/release.yml` through npm trusted publishing with provenance.

## Development

```sh
pnpm check
pnpm test:integration
```

Checks cover formatting, lint, TypeScript, per-file 100% V8 coverage of the installer and utility code, and compiled component behavior. Integration tests pack and extract the actual npm artifact, install it into a temporary app, validate registry payloads and exercise the built playground in Chromium, including mobile layout, keyboard focus and reduced motion.

The CLI uses TypeScript 7.0.2. The playground uses the pinned 7.1 nightly and `--runExternalCode` for vibe.js content mappers. `pnpm dev`, `pnpm build` and `pnpm check` regenerate the ignored playground component copies from the registry.

## Next

Dialog, Dropdown Menu, Select, Combobox and other composite widgets need a native vibe.js behavior layer, with focus management, keyboard navigation, dismissal and assistive technology verification. They are not included yet. SSR and hydration follow vibe.js's future support. A compiled npm component library depends on a supported framework packaging contract.

## License

MIT. See [LICENSE](LICENSE), [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) and the upstream revision recorded there. Source installation includes both project and upstream MIT notices in `vibecn.LICENSE`.
