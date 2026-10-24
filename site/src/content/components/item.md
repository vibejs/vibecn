---
title: Item
description: A versatile component for displaying content with media, a title, a description and actions.
---

<Example name="item-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Item from '@/components/ui/Item.vibe';
import ItemActions from '@/components/ui/ItemActions.vibe';
import ItemContent from '@/components/ui/ItemContent.vibe';
import ItemDescription from '@/components/ui/ItemDescription.vibe';
import ItemMedia from '@/components/ui/ItemMedia.vibe';
import ItemTitle from '@/components/ui/ItemTitle.vibe';
</script>

<template>
  <Item variant="outline">
    <ItemMedia variant="icon"><svg>...</svg></ItemMedia>
    <ItemContent>
      <ItemTitle>Item</ItemTitle>
      <ItemDescription>Item description</ItemDescription>
    </ItemContent>
    <ItemActions>
      <Button size="sm">Action</Button>
    </ItemActions>
  </Item>
</template>
```

## Examples

### Group

<Example name="item-group" />

## API Reference

| Component                                                                                | Prop      | Type                                | Default     |
| ---------------------------------------------------------------------------------------- | --------- | ----------------------------------- | ----------- |
| `Item`                                                                                   | `variant` | `'default' \| 'outline' \| 'muted'` | `'default'` |
|                                                                                          | `size`    | `'default' \| 'sm'`                 | `'default'` |
| `ItemMedia`                                                                              | `variant` | `'default' \| 'icon' \| 'image'`    | `'default'` |
| `ItemGroup`                                                                              |           |                                     |             |
| `ItemSeparator`                                                                          |           |                                     |             |
| `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter` |           |                                     |             |

`ItemGroup` has the `list` role; give each `Item` in it `role="listitem"`.
