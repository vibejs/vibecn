---
title: Select
description: Displays a list of options for the user to pick from, triggered by a button.
---

<Example name="select-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Select from '@/components/ui/Select.vibe';
import SelectContent from '@/components/ui/SelectContent.vibe';
import SelectItem from '@/components/ui/SelectItem.vibe';
import SelectTrigger from '@/components/ui/SelectTrigger.vibe';
import SelectValue from '@/components/ui/SelectValue.vibe';

const theme = ref('');
</script>

<template>
  <Select v-model="theme">
    <SelectTrigger class="w-[180px]" aria-label="Theme">
      <SelectValue placeholder="Theme" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="light">Light</SelectItem>
      <SelectItem value="dark">Dark</SelectItem>
      <SelectItem value="system">System</SelectItem>
    </SelectContent>
  </Select>
</template>
```

For a plain form field that uses the platform's picker, especially on mobile, prefer [Native Select](/docs/components/native-select).

## Examples

### Groups and scrolling

<Example name="select-scrollable" />

## API Reference

| Component                                       | Prop           | Type                           | Default     |
| ----------------------------------------------- | -------------- | ------------------------------ | ----------- |
| `Select`                                        | `v-model`      | `string`                       | `''`        |
|                                                 | `v-model:open` | `boolean`                      | `false`     |
|                                                 | `name`         | `string`                       |             |
| `SelectTrigger`                                 | `size`         | `'default' \| 'sm'`            | `'default'` |
|                                                 | `disabled`     | `boolean`                      | `false`     |
| `SelectValue`                                   | `placeholder`  | `string`                       | `''`        |
| `SelectContent`                                 | `side`         | `'top' \| 'bottom'`            | `'bottom'`  |
|                                                 | `align`        | `'start' \| 'center' \| 'end'` | `'start'`   |
|                                                 | `sideOffset`   | `number`                       | `4`         |
| `SelectItem`                                    | `value`        | `string`                       |             |
|                                                 | `disabled`     | `boolean`                      | `false`     |
| `SelectGroup`, `SelectLabel`, `SelectSeparator` |                |                                |             |

With a `name`, the value is submitted with the form in a hidden input. The list scrolls natively when it is taller than 20rem; the upstream scroll buttons are not included.

## Accessibility

The trigger is a `combobox` that controls a `listbox`. <kbd>ArrowDown</kbd>, <kbd>ArrowUp</kbd>, <kbd>Enter</kbd> and <kbd>Space</kbd> open the list on the selected option. In the list, the arrow keys, <kbd>Home</kbd>, <kbd>End</kbd> and typing move between options, <kbd>Enter</kbd> or <kbd>Space</kbd> selects one, and <kbd>Escape</kbd> closes the list and returns focus to the trigger. Name the trigger with `aria-label` or a `Label`.
