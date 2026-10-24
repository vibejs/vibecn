---
title: Combobox
description: An input combined with a list of suggestions that filters as you type.
---

<Example name="combobox-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Combobox from '@/components/ui/Combobox.vibe';
import ComboboxContent from '@/components/ui/ComboboxContent.vibe';
import ComboboxEmpty from '@/components/ui/ComboboxEmpty.vibe';
import ComboboxInput from '@/components/ui/ComboboxInput.vibe';
import ComboboxItem from '@/components/ui/ComboboxItem.vibe';
import ComboboxList from '@/components/ui/ComboboxList.vibe';

const framework = ref('');
</script>

<template>
  <Combobox v-model="framework">
    <ComboboxInput placeholder="Select framework..." aria-label="Framework" />
    <ComboboxContent>
      <ComboboxEmpty>No framework found.</ComboboxEmpty>
      <ComboboxList>
        <ComboboxItem value="vibejs">vibe.js</ComboboxItem>
        <ComboboxItem value="next">Next.js</ComboboxItem>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
</template>
```

Typing opens the list and hides the items whose label does not contain the text. Selecting an item puts its label in the input; when the list closes without a selection, the input shows the selected label again.

## API Reference

| Component                                                                              | Prop                          | Type      | Default                    |
| -------------------------------------------------------------------------------------- | ----------------------------- | --------- | -------------------------- |
| `Combobox`                                                                             | `v-model`                     | `string`  | `''`                       |
|                                                                                        | `v-model:open`                | `boolean` | `false`                    |
|                                                                                        | `name`                        | `string`  |                            |
| `ComboboxInput`                                                                        | `placeholder`                 | `string`  |                            |
|                                                                                        | `showTrigger`                 | `boolean` | `true`                     |
|                                                                                        | `showClear`                   | `boolean` | `false`                    |
|                                                                                        | `disabled`                    | `boolean` | `false`                    |
| `ComboboxContent`                                                                      | `side`, `align`, `sideOffset` |           | `'bottom'`, `'start'`, `6` |
| `ComboboxItem`                                                                         | `value`                       | `string`  |                            |
|                                                                                        | `disabled`                    | `boolean` | `false`                    |
| `ComboboxList`, `ComboboxGroup`, `ComboboxLabel`, `ComboboxSeparator`, `ComboboxEmpty` |                               |           |                            |

`ComboboxEmpty` shows itself while no item is visible. Multiple selection with chips is not included in this version.

## Accessibility

Focus stays in the input, a `combobox` with `aria-autocomplete="list"`. <kbd>ArrowDown</kbd> and <kbd>ArrowUp</kbd> open the list and move the active option, which the input reports with `aria-activedescendant`; <kbd>Enter</kbd> selects it and <kbd>Escape</kbd> closes the list.
