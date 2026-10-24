---
title: Input Group
description: Add icons, text and buttons to inputs and textareas.
---

<Example name="input-group-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import InputGroup from '@/components/ui/InputGroup.vibe';
import InputGroupAddon from '@/components/ui/InputGroupAddon.vibe';
import InputGroupButton from '@/components/ui/InputGroupButton.vibe';
import InputGroupInput from '@/components/ui/InputGroupInput.vibe';

const query = ref('');
</script>

<template>
  <InputGroup>
    <InputGroupInput v-model="query" placeholder="Search..." aria-label="Search" />
    <InputGroupAddon align="inline-end">
      <InputGroupButton>Search</InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
</template>
```

Place addons after the control in the markup; `align` moves them into position. A click on an addon focuses the control, unless it lands on a button.

## API Reference

| Component            | Prop      | Type                                                             | Default          |
| -------------------- | --------- | ---------------------------------------------------------------- | ---------------- |
| `InputGroupAddon`    | `align`   | `'inline-start' \| 'inline-end' \| 'block-start' \| 'block-end'` | `'inline-start'` |
| `InputGroupButton`   | `size`    | `'xs' \| 'sm' \| 'icon-xs' \| 'icon-sm'`                         | `'xs'`           |
|                      | `variant` | Button variants                                                  | `'ghost'`        |
| `InputGroupInput`    | `v-model` | `string`                                                         | `''`             |
|                      | `type`    | Input types                                                      | `'text'`         |
| `InputGroupTextarea` | `v-model` | `string`                                                         | `''`             |
| `InputGroupText`     |           |                                                                  |                  |

`InputGroupInput` and `InputGroupTextarea` accept the same props as `Input` and `Textarea`.

## Accessibility

Addons are not labels. Give the control an accessible name with `aria-label` or a `Label`, and give icon-only buttons an `aria-label`.
