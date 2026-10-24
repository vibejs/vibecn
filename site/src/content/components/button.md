---
title: Button
description: Displays a button or a component that looks like a button.
---

<Example name="button-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Button from '@/components/ui/Button.vibe';
</script>

<template>
  <Button variant="outline">Button</Button>
</template>
```

Button renders a native `<button>` and defaults to `type="button"`, so it never submits a form by accident. Set `type="submit"` when it should.

## Examples

### Secondary

<Example name="button-secondary" />

### Outline

<Example name="button-outline" />

### Ghost

<Example name="button-ghost" />

### Destructive

<Example name="button-destructive" />

### Link

<Example name="button-link" />

### Sizes

<Example name="button-sizes" />

### With an icon

Icons inside a button are sized to `1rem` and ignore pointer events. Mark decorative icons with `aria-hidden="true"`.

<Example name="button-with-icon" />

### In a form

<Example name="button-submit" />

## API Reference

| Prop       | Type                                                                          | Default     |
| ---------- | ----------------------------------------------------------------------------- | ----------- |
| `variant`  | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` |
| `size`     | `'default' \| 'sm' \| 'lg' \| 'icon'`                                         | `'default'` |
| `type`     | `'button' \| 'submit' \| 'reset'`                                             | `'button'`  |
| `disabled` | `boolean`                                                                     | `false`     |
| `name`     | `string`                                                                      |             |
| `value`    | `string`                                                                      |             |
| `class`    | `ClassValue`                                                                  |             |

Other attributes and listeners, such as `aria-label`, `form` or `@click`, are passed to the `<button>` element.

## Accessibility

- An icon-only button needs an accessible name. Use `aria-label`, as in the `icon` size example.
- To render a link that looks like a button, use an `<a>` element with the button classes instead. A link navigates; a button acts. `asChild` is not supported.
