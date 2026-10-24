---
title: Toggle
description: A two-state button that can be either on or off.
---

<Example name="toggle-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Toggle from '@/components/ui/Toggle.vibe';

const bold = ref(false);
</script>

<template>
  <Toggle v-model:pressed="bold" aria-label="Toggle bold">B</Toggle>
</template>
```

## API Reference

| Prop              | Type                        | Default     |
| ----------------- | --------------------------- | ----------- |
| `v-model:pressed` | `boolean`                   | `false`     |
| `variant`         | `'default' \| 'outline'`    | `'default'` |
| `size`            | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `disabled`        | `boolean`                   | `false`     |
| `class`           | `ClassValue`                |             |

## Accessibility

Toggle is a `<button>` with `aria-pressed`, announced as a toggle button that is pressed or not. Keep its label the same in both states; the pressed state already says whether it is on.
