---
title: Alert
description: Displays a callout for user attention.
---

<Example name="alert-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Alert from '@/components/ui/Alert.vibe';
import AlertDescription from '@/components/ui/AlertDescription.vibe';
import AlertTitle from '@/components/ui/AlertTitle.vibe';
</script>

<template>
  <Alert>
    <svg>...</svg>
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
  </Alert>
</template>
```

An `<svg>` placed directly inside the alert becomes its icon and the content moves into a second column.

## Examples

### Destructive

<Example name="alert-destructive" />

## API Reference

| Component          | Prop      | Type                         | Default     |
| ------------------ | --------- | ---------------------------- | ----------- |
| `Alert`            | `variant` | `'default' \| 'destructive'` | `'default'` |
| `AlertTitle`       |           |                              |             |
| `AlertDescription` |           |                              |             |

Every part accepts `class` and renders a `<div>`.

## Accessibility

`Alert` has the `alert` role, so screen readers announce it as soon as it appears. Use it for messages that need immediate attention. For static information that is part of the page, remove the role: `<Alert role="none">`.
