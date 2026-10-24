---
title: Introduction
description: Accessible, beautifully designed components for vibe.js that you copy into your app and own.
---

vibecn is a port of [shadcn/ui](https://ui.shadcn.com) for [vibe.js](https://vibejs.org). It is not a component library you install and import from `node_modules`. It is a collection of components that you **copy into your application as `.vibe` source**, then read, change and keep.

## Why source code?

A packaged component library is convenient until you need a component to behave slightly differently. Then you wrap it, override its styles, or wait for an option to be added upstream.

With vibecn, the code is yours from the start:

- **Open code.** Every component is a single `.vibe` file in your project. Change the markup, the classes or the behavior directly.
- **Composition.** Components share one predictable API: native attributes pass through, `class` merges with the defaults, and models use `v-model`.
- **Beautiful defaults.** The styles follow shadcn/ui's design language, built on Tailwind CSS v4 and CSS variables.
- **No runtime dependency.** Your application compiles the components with its own vibe.js compiler. vibecn adds nothing to your bundle besides the code you copy.

## Native first

vibe.js compiles templates directly to DOM operations and has no virtual DOM. vibecn follows the same spirit: a Button is a `<button>`, an Input is an `<input>`, and composite widgets build on platform features such as `<dialog>` and the `popover` attribute wherever the browser already provides correct focus, keyboard and accessibility behavior.

A component is only published once its keyboard, focus and screen reader behavior has been verified. If a component you need is not here yet, it is on the way.

## Browser support

vibecn supports the browsers that implement the popover API and modal dialogs: Chrome and Edge 114, Safari 17 and Firefox 125 or later. Animations use `@starting-style` where the browser supports it and are skipped elsewhere, and whenever the user prefers reduced motion.

## How it works

1. `vibecn init` adds a configuration file, the theme stylesheet and the license notices to your app.
2. `vibecn add button` copies `Button.vibe` and the shared `cn()` class utility into your source directory.
3. You import the component like any other file in your app.

```vibe
<script setup lang="ts">
import Button from '@/components/ui/Button.vibe';
</script>

<template>
  <Button variant="outline">Click me</Button>
</template>
```

Continue with the [installation guide](/docs/installation), or browse the [components](/docs/components).

## Credits

vibecn adapts the design and structure of [shadcn/ui](https://ui.shadcn.com) by shadcn, licensed under MIT. It is an independent project and is not affiliated with or endorsed by shadcn/ui.
