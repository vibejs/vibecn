---
title: Native Select
description: A styled native HTML select element with consistent design system integration.
---

<Example name="native-select-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import NativeSelect from '@/components/ui/NativeSelect.vibe';
import NativeSelectOption from '@/components/ui/NativeSelectOption.vibe';

const status = ref('');
</script>

<template>
  <NativeSelect v-model="status" aria-label="Status">
    <NativeSelectOption value="">Select a status</NativeSelectOption>
    <NativeSelectOption value="todo">Todo</NativeSelectOption>
    <NativeSelectOption value="done">Done</NativeSelectOption>
  </NativeSelect>
</template>
```

A native select uses the platform's picker, which is the best choice on mobile devices and inside forms. A custom Select with a styled list is planned separately.

## API Reference

| Component              | Prop                                           | Type                | Default     |
| ---------------------- | ---------------------------------------------- | ------------------- | ----------- |
| `NativeSelect`         | `v-model`                                      | `string`            | `''`        |
|                        | `size`                                         | `'default' \| 'sm'` | `'default'` |
|                        | `name`, `disabled`, `required`, `autocomplete` |                     |             |
| `NativeSelectOption`   | `value`, `disabled`                            |                     |             |
| `NativeSelectOptGroup` | `label`, `disabled`                            |                     |             |

`class` and other attributes go to the `<select>`. The component exposes `focus()`.
