---
title: Skeleton
description: Use to show a placeholder while content is loading.
---

<Example name="skeleton-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vibe';
</script>

<template>
  <Skeleton class="h-5 w-[100px] rounded-full" />
</template>
```

## Examples

### Card

<Example name="skeleton-card" />

## API Reference

| Prop    | Type         | Default |
| ------- | ------------ | ------- |
| `class` | `ClassValue` |         |

## Accessibility

A skeleton is hidden from assistive technology. Announce the loading state on its container instead, for example with `role="status"` and an `aria-label`, as in the examples. The pulse animation stops when the user prefers reduced motion.
