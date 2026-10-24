---
title: Scroll Area
description: A scrollable region with slim scrollbars that follow the theme.
---

<Example name="scroll-area-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import ScrollArea from '@/components/ui/ScrollArea.vibe';
</script>

<template>
  <ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
    Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place.
  </ScrollArea>
</template>
```

## Examples

### Horizontal scrolling

Add a horizontal `ScrollBar` to let the content scroll sideways.

<Example name="scroll-area-horizontal" />

## API Reference

| Component    | Prop          | Type                         | Default      |
| ------------ | ------------- | ---------------------------- | ------------ |
| `ScrollArea` | `class`       | `ClassValue`                 |              |
| `ScrollBar`  | `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` |

The upstream component draws custom scrollbars with JavaScript. This port uses the browser's own scrollbars, styled thin with the `--border` color through `scrollbar-width` and `scrollbar-color`, so scrolling stays native on every device.

## Accessibility

The viewport is focusable, so keyboard users can scroll it with the arrow keys. Give it a name with `aria-label` when its content has no heading.
