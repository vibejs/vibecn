---
title: Switch
description: A control that allows the user to toggle between checked and not checked.
---

<Example name="switch-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Label from '@/components/ui/Label.vibe';
import Switch from '@/components/ui/Switch.vibe';

const enabled = ref(false);
</script>

<template>
  <div class="flex items-center gap-2">
    <Switch id="airplane-mode" v-model="enabled" />
    <Label for="airplane-mode">Airplane Mode</Label>
  </div>
</template>
```

## API Reference

| Prop       | Type                | Default     |
| ---------- | ------------------- | ----------- |
| `v-model`  | `boolean`           | `false`     |
| `size`     | `'default' \| 'sm'` | `'default'` |
| `name`     | `string`            |             |
| `value`    | `string`            |             |
| `disabled` | `boolean`           |             |
| `required` | `boolean`           |             |
| `class`    | `ClassValue`        |             |

The component exposes `focus()`.

## Accessibility

Switch is a native checkbox with the `switch` role: it toggles with <kbd>Space</kbd>, submits with forms and is announced as a switch that is on or off.
