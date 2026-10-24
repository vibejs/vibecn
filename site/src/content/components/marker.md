---
title: Marker
description: A line of status or context in a conversation, such as a date or a system event.
---

<Example name="marker-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Marker from '@/components/ui/Marker.vibe';
import MarkerContent from '@/components/ui/MarkerContent.vibe';
</script>

<template>
  <Marker variant="separator">
    <MarkerContent>Today</MarkerContent>
  </Marker>
</template>
```

## API Reference

| Component                     | Prop      | Type                                   | Default     |
| ----------------------------- | --------- | -------------------------------------- | ----------- |
| `Marker`                      | `variant` | `'default' \| 'separator' \| 'border'` | `'default'` |
| `MarkerIcon`, `MarkerContent` |           |                                        |             |

`MarkerIcon` is hidden from assistive technology; the content carries the meaning.
