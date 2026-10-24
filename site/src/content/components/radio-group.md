---
title: Radio Group
description: A set of checkable buttons, known as radio buttons, where no more than one can be checked at a time.
---

<Example name="radio-group-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Label from '@/components/ui/Label.vibe';
import RadioGroup from '@/components/ui/RadioGroup.vibe';
import RadioGroupItem from '@/components/ui/RadioGroupItem.vibe';

const plan = ref('monthly');
</script>

<template>
  <RadioGroup v-model="plan" aria-label="Billing plan">
    <div class="flex items-center gap-3">
      <RadioGroupItem id="monthly" value="monthly" />
      <Label for="monthly">Monthly</Label>
    </div>
    <div class="flex items-center gap-3">
      <RadioGroupItem id="yearly" value="yearly" />
      <Label for="yearly">Yearly</Label>
    </div>
  </RadioGroup>
</template>
```

## API Reference

| Component        | Prop       | Type      | Default   |
| ---------------- | ---------- | --------- | --------- |
| `RadioGroup`     | `v-model`  | `string`  |           |
|                  | `name`     | `string`  | generated |
|                  | `disabled` | `boolean` | `false`   |
|                  | `required` | `boolean` | `false`   |
| `RadioGroupItem` | `value`    | `string`  |           |
|                  | `disabled` | `boolean` | `false`   |

## Accessibility

The items are native radio buttons that share a name, so the browser provides the expected keyboard behavior: <kbd>Tab</kbd> moves to the checked item and the arrow keys move and check within the group. Name the group with `aria-label` or `aria-labelledby`.
