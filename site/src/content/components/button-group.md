---
title: Button Group
description: A container that groups related buttons together with consistent styling.
---

<Example name="button-group-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Button from '@/components/ui/Button.vibe';
import ButtonGroup from '@/components/ui/ButtonGroup.vibe';
</script>

<template>
  <ButtonGroup aria-label="Formatting">
    <Button variant="outline">Bold</Button>
    <Button variant="outline">Italic</Button>
  </ButtonGroup>
</template>
```

Nest button groups to create space between sets of buttons.

## Examples

### Orientation

<Example name="button-group-orientation" />

### Separator and text

`ButtonGroupSeparator` divides buttons that have no border, such as the secondary variant. `ButtonGroupText` shows static text in the group.

<Example name="button-group-separator" />

## API Reference

| Component              | Prop          | Type                         | Default        |
| ---------------------- | ------------- | ---------------------------- | -------------- |
| `ButtonGroup`          | `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `ButtonGroupSeparator` | `orientation` | `'horizontal' \| 'vertical'` | `'vertical'`   |
| `ButtonGroupText`      |               |                              |                |

## Accessibility

`ButtonGroup` has the `group` role. Give it an `aria-label` that describes the set of actions.
