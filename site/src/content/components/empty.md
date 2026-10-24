---
title: Empty
description: Use the Empty component to display an empty state.
---

<Example name="empty-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Empty from '@/components/ui/Empty.vibe';
import EmptyContent from '@/components/ui/EmptyContent.vibe';
import EmptyDescription from '@/components/ui/EmptyDescription.vibe';
import EmptyHeader from '@/components/ui/EmptyHeader.vibe';
import EmptyMedia from '@/components/ui/EmptyMedia.vibe';
import EmptyTitle from '@/components/ui/EmptyTitle.vibe';
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon"><svg>...</svg></EmptyMedia>
      <EmptyTitle>No data</EmptyTitle>
      <EmptyDescription>No data found.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button>Add data</Button>
    </EmptyContent>
  </Empty>
</template>
```

## API Reference

| Component          | Prop      | Type                  | Default     |
| ------------------ | --------- | --------------------- | ----------- |
| `Empty`            |           |                       |             |
| `EmptyHeader`      |           |                       |             |
| `EmptyMedia`       | `variant` | `'default' \| 'icon'` | `'default'` |
| `EmptyTitle`       |           |                       |             |
| `EmptyDescription` |           |                       |             |
| `EmptyContent`     |           |                       |             |

Add a `border` class to `Empty` for an outlined state.
