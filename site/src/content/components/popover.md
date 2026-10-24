---
title: Popover
description: Displays rich content in a floating panel, triggered by a button.
---

<Example name="popover-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Popover from '@/components/ui/Popover.vibe';
import PopoverContent from '@/components/ui/PopoverContent.vibe';
import PopoverTrigger from '@/components/ui/PopoverTrigger.vibe';
</script>

<template>
  <Popover>
    <PopoverTrigger variant="outline">Open</PopoverTrigger>
    <PopoverContent>Place content for the popover here.</PopoverContent>
  </Popover>
</template>
```

The content uses the native `popover` attribute: it renders in the top layer and closes on <kbd>Escape</kbd> or a click outside. The trigger toggles it with `popovertarget`.

## API Reference

| Component                                             | Prop                          | Type                                     | Default     |
| ----------------------------------------------------- | ----------------------------- | ---------------------------------------- | ----------- |
| `Popover`                                             | `v-model:open`                | `boolean`                                | `false`     |
| `PopoverTrigger`                                      | `variant`, `size`, `disabled` | Button props                             | `'default'` |
| `PopoverContent`                                      | `side`                        | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'`  |
|                                                       | `align`                       | `'start' \| 'center' \| 'end'`           | `'center'`  |
|                                                       | `sideOffset`                  | `number`                                 | `4`         |
|                                                       | `alignOffset`                 | `number`                                 | `0`         |
| `PopoverAnchor`                                       |                               |                                          |             |
| `PopoverHeader`, `PopoverTitle`, `PopoverDescription` |                               |                                          |             |

The content flips to the opposite side when there is not enough room and stays inside the viewport. Wrap an element in `PopoverAnchor` to position the content against it instead of the trigger.

## Accessibility

The popover is non-modal: focus is not trapped, and the rest of the page stays usable. The trigger reports whether the popover is expanded.
