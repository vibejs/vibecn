---
title: Textarea
description: Displays a form textarea.
---

<Example name="textarea-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Textarea from '@/components/ui/Textarea.vibe';

const message = ref('');
</script>

<template>
  <Textarea v-model="message" />
</template>
```

## Examples

### With a label

<Example name="textarea-with-label" />

### With a button

<Example name="textarea-with-button" />

## API Reference

| Prop           | Type         | Default |
| -------------- | ------------ | ------- |
| `v-model`      | `string`     | `''`    |
| `rows`         | `number`     |         |
| `name`         | `string`     |         |
| `placeholder`  | `string`     |         |
| `disabled`     | `boolean`    |         |
| `required`     | `boolean`    |         |
| `readonly`     | `boolean`    |         |
| `autocomplete` | `string`     |         |
| `class`        | `ClassValue` |         |

Other attributes and listeners are passed to the `<textarea>` element. The component exposes `focus()` through a template ref.
