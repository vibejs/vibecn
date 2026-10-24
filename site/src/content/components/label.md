---
title: Label
description: Renders an accessible label associated with a control.
---

<Example name="label-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Label from '@/components/ui/Label.vibe';
</script>

<template>
  <Label for="email">Your email address</Label>
</template>
```

## API Reference

| Prop    | Type         | Default |
| ------- | ------------ | ------- |
| `for`   | `string`     |         |
| `class` | `ClassValue` |         |

Label renders a native `<label>`. Clicking it focuses or toggles the control whose `id` matches `for`.
