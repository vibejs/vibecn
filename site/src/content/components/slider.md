---
title: Slider
description: An input where the user selects a value from within a given range.
---

<Example name="slider-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Slider from '@/components/ui/Slider.vibe';

const volume = ref([50]);
</script>

<template>
  <Slider v-model="volume" :max="100" :step="1" :labels="['Volume']" />
</template>
```

The model is an array: one value for a single thumb, two for a range. Thumbs never cross each other.

## API Reference

| Prop       | Type         | Default |
| ---------- | ------------ | ------- |
| `v-model`  | `number[]`   | `[0]`   |
| `min`      | `number`     | `0`     |
| `max`      | `number`     | `100`   |
| `step`     | `number`     | `1`     |
| `labels`   | `string[]`   | `[]`    |
| `name`     | `string`     |         |
| `disabled` | `boolean`    | `false` |
| `class`    | `ClassValue` |         |

Each thumb is a native `<input type="range">`. Vertical sliders are not supported yet.

## Accessibility

Thumbs support the arrow keys, <kbd>Page Up</kbd>, <kbd>Page Down</kbd>, <kbd>Home</kbd> and <kbd>End</kbd> natively. Give every thumb an accessible name through `labels`.
