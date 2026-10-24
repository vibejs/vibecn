---
title: Badge
description: Displays a badge or a component that looks like a badge.
---

<Example name="badge-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Badge from '@/components/ui/Badge.vibe';
</script>

<template>
  <Badge variant="outline">Badge</Badge>
</template>
```

## Examples

### Custom styles

Combine `class` with the variants for counters, icons and status colors.

<Example name="badge-custom" />

## API Reference

| Prop      | Type                                                     | Default     |
| --------- | -------------------------------------------------------- | ----------- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline'` | `'default'` |
| `class`   | `ClassValue`                                             |             |

Badge renders a `<span>`. Other attributes are passed to it.
