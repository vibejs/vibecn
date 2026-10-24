---
title: Tooltip
description: A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
---

<Example name="tooltip-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Tooltip from '@/components/ui/Tooltip.vibe';
import TooltipContent from '@/components/ui/TooltipContent.vibe';
import TooltipTrigger from '@/components/ui/TooltipTrigger.vibe';
</script>

<template>
  <Tooltip>
    <TooltipTrigger variant="outline">Hover</TooltipTrigger>
    <TooltipContent>Add to library</TooltipContent>
  </Tooltip>
</template>
```

## API Reference

| Component        | Prop                                         | Type                | Default                       |
| ---------------- | -------------------------------------------- | ------------------- | ----------------------------- |
| `Tooltip`        | `v-model:open`                               | `boolean`           | `false`                       |
|                  | `delayDuration`                              | `number`            | `0`                           |
|                  | `closeDelay`                                 | `number`            | `0`                           |
| `TooltipTrigger` | `variant`, `size`, `disabled`                | Button props        | `'default'`                   |
| `TooltipContent` | `side`, `align`, `sideOffset`, `alignOffset` | Like PopoverContent | `'top'`, `'center'`, `6`, `0` |

## Accessibility

- The tooltip opens on hover and on keyboard focus, and closes on blur, on a press and on <kbd>Escape</kbd>.
- While it is open, the trigger is described by the tooltip content.
- A tooltip is supplementary. Do not put essential information or interactive content in it; touch devices cannot hover.
