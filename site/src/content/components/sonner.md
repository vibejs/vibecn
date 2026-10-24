---
title: Sonner
description: An opinionated toast component.
---

<Example name="sonner-demo" />

## Installation

<Installation />

Add the `Toaster` once, at the root of your app:

```vibe
<script setup lang="ts">
import Toaster from '@/components/ui/Toaster.vibe';
</script>

<template>
  <RouterView />
  <Toaster />
</template>
```

## Usage

```ts
import { toast } from '@/lib/toast.ts';

toast('Event has been created.');
```

`toast` works anywhere, including outside components. It returns the toast's id.

## Examples

### Types

<Example name="sonner-types" />

## API Reference

### toast

| Function                                                      | Description                                                                                                  |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `toast(title, options?)`                                      | A plain toast.                                                                                               |
| `toast.success`, `toast.info`, `toast.warning`, `toast.error` | A toast with an icon for its type.                                                                           |
| `toast.loading(title, options?)`                              | A toast that stays until it is replaced or dismissed.                                                        |
| `toast.promise(promise, { loading, success, error })`         | A loading toast that becomes a success or error toast. `success` and `error` can be functions of the result. |
| `toast.dismiss(id?)`                                          | Closes one toast, or all of them.                                                                            |

| Option        | Type                 | Description                                              |
| ------------- | -------------------- | -------------------------------------------------------- |
| `id`          | `string`             | Reusing an id replaces that toast.                       |
| `description` | `string`             | Secondary text.                                          |
| `duration`    | `number`             | Milliseconds before closing. `Infinity` keeps the toast. |
| `action`      | `{ label, onClick }` | A button that runs `onClick` and closes the toast.       |

### Toaster

| Prop            | Type                                                                                              | Default          |
| --------------- | ------------------------------------------------------------------------------------------------- | ---------------- |
| `position`      | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'bottom-right'` |
| `duration`      | `number`                                                                                          | `4000`           |
| `visibleToasts` | `number`                                                                                          | `3`              |
| `expand`        | `boolean`                                                                                         | `false`          |
| `closeButton`   | `boolean`                                                                                         | `false`          |

This is a port of [Sonner](https://sonner.emilkowal.ski)'s design: toasts stack and expand on hover. Swipe to dismiss is not included.

## Accessibility

- The toaster is a labelled region in the top layer, above dialogs. Toasts are announced politely; error toasts assertively.
- Hovering or focusing the toasts pauses their timers, so there is time to read them and reach their actions.
