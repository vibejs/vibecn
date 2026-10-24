---
title: Separator
description: Visually or semantically separates content.
---

<Example name="separator-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Separator from '@/components/ui/Separator.vibe';
</script>

<template>
  <Separator />
</template>
```

## API Reference

| Prop          | Type                         | Default        |
| ------------- | ---------------------------- | -------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `decorative`  | `boolean`                    | `true`         |
| `class`       | `ClassValue`                 |                |

A vertical separator needs a parent with a defined height.

## Accessibility

By default a separator is decorative and hidden from assistive technology, as most separators only add visual rhythm. When it divides distinct sections of content, set `:decorative="false"`: it then has the `separator` role and announces its orientation.
