---
title: Input
description: Displays a form input field.
---

<Example name="input-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Input from '@/components/ui/Input.vibe';

const email = ref('');
</script>

<template>
  <Input v-model="email" type="email" placeholder="Email" />
</template>
```

## Examples

### With a label

<Example name="input-with-label" />

### Disabled

<Example name="input-disabled" />

### With a button

<Example name="input-with-button" />

### Invalid

Set `aria-invalid` to show the error style and tell assistive technology the value is invalid. Point `aria-describedby` at the message.

<Example name="input-invalid" />

## API Reference

| Prop           | Type                                                            | Default  |
| -------------- | --------------------------------------------------------------- | -------- |
| `v-model`      | `string`                                                        | `''`     |
| `type`         | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url'` | `'text'` |
| `name`         | `string`                                                        |          |
| `placeholder`  | `string`                                                        |          |
| `disabled`     | `boolean`                                                       |          |
| `required`     | `boolean`                                                       |          |
| `readonly`     | `boolean`                                                       |          |
| `autocomplete` | `string`                                                        |          |
| `class`        | `ClassValue`                                                    |          |

Other attributes and listeners are passed to the `<input>` element. The component exposes `focus()` through a template ref.

Number, date, checkbox, radio and file inputs have their own behavior and are not covered by this component.
