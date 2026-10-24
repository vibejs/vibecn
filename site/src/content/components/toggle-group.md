---
title: Toggle Group
description: A set of two-state buttons that can be toggled on or off.
---

<Example name="toggle-group-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import ToggleGroup from '@/components/ui/ToggleGroup.vibe';
import ToggleGroupItem from '@/components/ui/ToggleGroupItem.vibe';

const alignment = ref('left');
</script>

<template>
  <ToggleGroup v-model="alignment" aria-label="Text alignment">
    <ToggleGroupItem value="left">Left</ToggleGroupItem>
    <ToggleGroupItem value="center">Center</ToggleGroupItem>
    <ToggleGroupItem value="right">Right</ToggleGroupItem>
  </ToggleGroup>
</template>
```

## Examples

### Single, with spacing

<Example name="toggle-group-single" />

## API Reference

| Component         | Prop             | Type                         | Default        |
| ----------------- | ---------------- | ---------------------------- | -------------- |
| `ToggleGroup`     | `type`           | `'single' \| 'multiple'`     | `'single'`     |
|                   | `v-model`        | `string`                     | `''`           |
|                   | `v-model:values` | `string[]`                   | `[]`           |
|                   | `variant`        | `'default' \| 'outline'`     | `'default'`    |
|                   | `size`           | `'default' \| 'sm' \| 'lg'`  | `'default'`    |
|                   | `spacing`        | `number`                     | `0`            |
|                   | `orientation`    | `'horizontal' \| 'vertical'` | `'horizontal'` |
|                   | `disabled`       | `boolean`                    | `false`        |
| `ToggleGroupItem` | `value`          | `string`                     |                |
|                   | `disabled`       | `boolean`                    | `false`        |

Use `v-model` with `type="single"` and `v-model:values` with `type="multiple"`. Pressing the pressed item of a single group clears it.

## Accessibility

The group is one stop in the tab order. The arrow keys move between items, <kbd>Home</kbd> and <kbd>End</kbd> go to the first and last, and <kbd>Space</kbd> or <kbd>Enter</kbd> presses an item. Each item is a toggle button with `aria-pressed`. Name the group with `aria-label`, and icon-only items too.
