---
title: Spinner
description: An indicator that can be used to show a loading state.
---

<Example name="spinner-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Spinner from '@/components/ui/Spinner.vibe';
</script>

<template>
  <Spinner />
</template>
```

Change the size with `size-*` classes and the color with `text-*` classes.

## API Reference

| Prop    | Type         | Default     |
| ------- | ------------ | ----------- |
| `label` | `string`     | `'Loading'` |
| `class` | `ClassValue` |             |

## Accessibility

Spinner has the `status` role and an accessible name from `label`. Inside a button that already says "Loading", add `aria-hidden="true"` to the spinner so the state is not announced twice.
