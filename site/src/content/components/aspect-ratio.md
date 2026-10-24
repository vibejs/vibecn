---
title: Aspect Ratio
description: Displays content within a desired ratio.
---

<Example name="aspect-ratio-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import AspectRatio from '@/components/ui/AspectRatio.vibe';
</script>

<template>
  <AspectRatio :ratio="16 / 9">
    <img src="/photo.jpg" alt="A mountain lake" class="size-full rounded-md object-cover" />
  </AspectRatio>
</template>
```

## API Reference

| Prop    | Type         | Default |
| ------- | ------------ | ------- |
| `ratio` | `number`     | `1`     |
| `class` | `ClassValue` |         |

The component uses the CSS `aspect-ratio` property, so it needs no measuring script.
