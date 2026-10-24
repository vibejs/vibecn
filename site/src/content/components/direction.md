---
title: Direction
description: Sets the text direction for the components inside it, left to right or right to left.
---

<Example name="direction-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import DirectionProvider from '@/components/ui/DirectionProvider.vibe';
</script>

<template>
  <DirectionProvider dir="rtl">
    <App />
  </DirectionProvider>
</template>
```

For a whole right-to-left app, setting `<html dir="rtl">` is enough; use `DirectionProvider` for a part of a page.

Components read the direction from the nearest `dir` attribute, so they follow it without any configuration:

- The arrow keys swap in right-to-left text in Tabs, Toggle Group, Menubar, Calendar, Carousel and Resizable, and submenus open with <kbd>ArrowLeft</kbd>.
- Popovers, menus and tooltips mirror their `start` and `end` alignment and their left and right sides.
- Layout uses Tailwind's logical utilities where upstream does, so spacing flips with the text.

## API Reference

| Prop  | Type             | Default |
| ----- | ---------------- | ------- |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` |

In your own code, `isRtl(element)` and `logicalKey(key, element)` from `lib/collection.ts` give the same behavior.
