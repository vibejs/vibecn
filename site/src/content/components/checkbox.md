---
title: Checkbox
description: A control that allows the user to toggle between checked and not checked.
---

<Example name="checkbox-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Checkbox from '@/components/ui/Checkbox.vibe';
import Label from '@/components/ui/Label.vibe';

const accepted = ref(false);
</script>

<template>
  <div class="flex items-center gap-3">
    <Checkbox id="terms" v-model="accepted" />
    <Label for="terms">Accept terms and conditions</Label>
  </div>
</template>
```

## Examples

### Indeterminate

Set `indeterminate` when some, but not all, of a group are checked.

<Example name="checkbox-indeterminate" />

## API Reference

| Prop            | Type         | Default |
| --------------- | ------------ | ------- |
| `v-model`       | `boolean`    | `false` |
| `indeterminate` | `boolean`    | `false` |
| `name`          | `string`     |         |
| `value`         | `string`     |         |
| `disabled`      | `boolean`    |         |
| `required`      | `boolean`    |         |
| `class`         | `ClassValue` |         |

The component exposes `focus()`. Other attributes, such as `id` and `aria-invalid`, are passed to the input.

## Accessibility

Checkbox is a native `<input type="checkbox">`: it is focusable, toggles with <kbd>Space</kbd>, takes part in form submission and validation, and is announced as a checkbox. Associate it with a `Label` through `id` and `for`.
