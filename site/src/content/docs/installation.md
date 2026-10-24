---
title: Installation
description: Add vibecn to a new or existing vibe.js application.
order: 1
---

## Requirements

- A vibe.js application using `@usevibejs/ui` and the `@usevibejs/compiler` Vite plugin.
- [Tailwind CSS v4](https://tailwindcss.com) with its Vite plugin.
- Node.js `^24.15.0` or `>=26`.

If you are starting from scratch, create an application first:

```bash
pnpm create vibejs my-app
```

## Add Tailwind CSS

Install Tailwind CSS and its Vite plugin:

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

Add the plugin next to the vibe.js plugin in `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite';
import { vibe } from '@usevibejs/compiler/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vibe(), tailwindcss()],
});
```

## Configure the import alias

The examples in this documentation import components from `@/components/ui`. Point `@` to your source directory in `vite.config.ts`:

```ts
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vibe(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('src', import.meta.url)) },
  },
});
```

And in `tsconfig.json`, so the language tools resolve the same paths:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

The alias is optional. Components installed by the CLI import each other with relative paths, so they work without it.

## Initialize vibecn

Run `init` from the root of your application:

```bash
pnpm dlx @usevibejs/vibecn@latest init
```

This creates three files and changes nothing else:

| File             | Purpose                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| `vibecn.json`    | Where components, utilities and the theme are written.                   |
| `src/vibecn.css` | The theme: design tokens as CSS variables, light and dark.               |
| `vibecn.LICENSE` | The MIT notices of vibecn and shadcn/ui. Keep it with the copied source. |

In a full-stack project with a `ui` directory, the paths start at `ui/src` instead of `src`.

## Import the theme

Import the theme after Tailwind in your main stylesheet:

```css
@import 'tailwindcss';
@import './vibecn.css';
```

## Install the shared dependencies

Components merge classes with [clsx](https://github.com/lukeed/clsx) and [tailwind-merge](https://github.com/dcastil/tailwind-merge):

```bash
pnpm add clsx tailwind-merge
```

## Add components

```bash
pnpm dlx @usevibejs/vibecn@latest add button card input label
```

The files are now part of your application:

```vibe
<script setup lang="ts">
import Button from '@/components/ui/Button.vibe';
</script>

<template>
  <Button>Hello vibecn</Button>
</template>
```

The CLI never edits your `package.json`, runs a package manager or changes existing stylesheets. See the [CLI reference](/docs/cli) for every command and option.
