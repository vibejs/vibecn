---
title: Progress
description: Displays an indicator showing the completion progress of a task.
---

<Example name="progress-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Progress from '@/components/ui/Progress.vibe';
</script>

<template>
  <Progress :value="33" aria-label="Upload progress" />
</template>
```

## API Reference

| Prop    | Type             | Default |
| ------- | ---------------- | ------- |
| `value` | `number \| null` | `null`  |
| `max`   | `number`         | `100`   |
| `class` | `ClassValue`     |         |

## Accessibility

Progress has the `progressbar` role with `aria-valuenow` and `aria-valuemax`. A `null` value omits `aria-valuenow`, which announces an indeterminate state. Give it an accessible name with `aria-label` or `aria-labelledby`.
