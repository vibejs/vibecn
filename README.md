# vibecn

Accessible, beautifully designed components for [vibe.js](https://vibejs.org), adapted from [shadcn/ui](https://ui.shadcn.com).

vibecn is not a component library you import from `node_modules`. The CLI copies `.vibe` source into your application, where you own it: read it, change it, keep it. Your app compiles the components with its own vibe.js compiler, so there is no runtime to install.

**Documentation:** https://vibecn.dev

This project is independent and not affiliated with or endorsed by shadcn/ui.

## Quick start

From the root of a vibe.js application that uses Tailwind CSS v4:

```sh
pnpm dlx @usevibejs/vibecn@latest init
pnpm add clsx tailwind-merge
pnpm dlx @usevibejs/vibecn@latest add button card input
```

Import the theme after Tailwind in your stylesheet:

```css
@import 'tailwindcss';
@import './vibecn.css';
```

Then use the components:

```vibe
<script setup lang="ts">
import Button from './components/ui/Button.vibe';
</script>

<template>
  <Button variant="outline">Hello vibecn</Button>
</template>
```

The [installation guide](https://vibecn.dev/docs/installation) covers the requirements, the import alias and dark mode. The [CLI reference](https://vibecn.dev/docs/cli) lists every command and option.

## Development

Use Node `^24.15.0 || >=26` and pnpm 12.14.0.

```sh
pnpm install
pnpm dev
```

`pnpm dev` starts the documentation site in `site/`. It installs every registry component into the site with the same installer a consumer app uses, so the docs always render the current source.

| Path                                | Contents                                                                                                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `registry/ui/`                      | The component sources, one `.vibe` file per part.                                                                                                               |
| `registry/lib/`, `registry/styles/` | The `cn()` utility and the theme.                                                                                                                               |
| `src/`                              | The CLI and installer.                                                                                                                                          |
| `site/src/content/`                 | Documentation pages in Markdown. `<Example name="..." />` embeds a live example from `site/src/examples/`; `<Installation />` renders the install instructions. |
| `site/src/examples/`                | Example components. Each one is rendered live and shown as code.                                                                                                |

### Adding a component

1. Add the source to `registry/ui/` and its entry to `src/registry.ts`.
2. Add examples to `site/src/examples/` and a page to `site/src/content/components/`.
3. Cover its behavior in `test/components.vibe.test.ts` and its page in `test/site.integration.test.ts`.
4. Run `pnpm changeset` to describe the change.

### Checks

```sh
pnpm check
pnpm test:integration
```

`pnpm check` runs formatting, lint, TypeScript and the unit and component tests with 100% per-file coverage of the CLI. `pnpm test:integration` builds everything, installs the packed npm artifact into a temporary app, validates the registry payloads and drives the documentation site in Chromium.

### Releases and deployment

Releases use changesets and `.github/workflows/release.yml`, which publishes to npm through trusted publishing with provenance. `pnpm build` writes the site to `site/dist/`, including the registry JSON under `/r/`; `npx wrangler deploy` publishes it as the `vibecn` Cloudflare Worker configured in `wrangler.jsonc`.

## License

MIT. See [LICENSE](LICENSE), [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) and the upstream revision recorded there. Source installation includes both project and upstream MIT notices in `vibecn.LICENSE`.

The `data-table` registry item adds a VibeTable-powered composition with native reactivity, typed `.vibe` cells, sorting, faceted filters, pagination, selection and column controls. Install with `vibecn add data-table`; the CLI reports the adapter dependency and copies editable source with the existing primitives. See the Data Table documentation for the working payments example.
