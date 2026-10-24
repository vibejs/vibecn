---
title: Pagination
description: Pagination with page navigation, next and previous links.
---

<Example name="pagination-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Pagination from '@/components/ui/Pagination.vibe';
import PaginationContent from '@/components/ui/PaginationContent.vibe';
import PaginationEllipsis from '@/components/ui/PaginationEllipsis.vibe';
import PaginationItem from '@/components/ui/PaginationItem.vibe';
import PaginationLink from '@/components/ui/PaginationLink.vibe';
import PaginationNext from '@/components/ui/PaginationNext.vibe';
import PaginationPrevious from '@/components/ui/PaginationPrevious.vibe';
</script>

<template>
  <Pagination>
    <PaginationContent>
      <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
      <PaginationItem><PaginationLink href="?page=1">1</PaginationLink></PaginationItem>
      <PaginationItem><PaginationLink href="?page=2" is-active>2</PaginationLink></PaginationItem>
      <PaginationItem><PaginationEllipsis /></PaginationItem>
      <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>
    </PaginationContent>
  </Pagination>
</template>
```

## API Reference

| Component                              | Prop       | Type                                  | Default  |
| -------------------------------------- | ---------- | ------------------------------------- | -------- |
| `PaginationLink`                       | `href`     | `string`                              |          |
|                                        | `isActive` | `boolean`                             | `false`  |
|                                        | `size`     | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'icon'` |
| `PaginationPrevious`, `PaginationNext` | `href`     | `string`                              |          |

## Accessibility

`Pagination` is a `<nav>` labelled `pagination`. The active link has `aria-current="page"`, and the previous and next links have accessible names even when their text is hidden on small screens.
