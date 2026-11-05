---
title: Data Table
description: A sortable, paged table shell that renders rows with @usevibejs/table and the Table primitives.
---

<Example name="data-table-sorted" align="start" />

## Installation

<Installation />

The copied `.vibe` files call `useTable` from `@usevibejs/table`. They do not reimplement TanStack Table. `@usevibejs/table` is an npm dependency of this block; the manual install command lists it with `clsx` and `tailwind-merge`.

## Usage

```vibe
<script setup lang="ts">
import DataTable from '@/components/ui/DataTable.vibe';

const rows = [
  { id: 'a', email: 'ada@example.com', amount: 10 },
  { id: 'b', email: 'blair@example.com', amount: 20 },
];
const columns = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];
</script>

<template>
  <DataTable :data="rows" :columns="columns" caption="Invoices" :page-size="10" />
</template>
```

`header` and `cell` are text, or the value returned by `componentRenderer` from `@usevibejs/table`. Use a `.vibe` component for markup. The shell renders that descriptor with the Table primitives.

Sorting and paging run on the array you pass. A sort returns to the first page. This shell is not a server row model. When the server sorts or pages, keep using [Table](/docs/components/table) and do that work in the request.

## Examples

### Selection pattern

This example is application code. It is not part of the `data-table` registry item. It filters, sorts, pages, selects and hides columns with Checkbox, Input and Dropdown Menu. Selected ids stay stable across pages.

<Example name="data-table-demo" align="start" />

## API Reference

| Prop       | Type                | Default |
| ---------- | ------------------- | ------- |
| `data`     | `readonly object[]` | `[]`    |
| `columns`  | `readonly object[]` | `[]`    |
| `caption`  | `string`            | `Data`  |
| `pageSize` | `number`            | `10`    |
| `class`    | `ClassValue`        |         |

A template ref exposes `table`, the `@usevibejs/table` instance. `DataTableContent` renders one header or cell and is installed with this block.

## Accessibility

The caption names the table. A sortable column header is a button with `aria-sort` of `none`, `ascending` or `descending`. Pagination is a navigation landmark. Previous and next disable at the ends, and the current page is a live status. An empty result is one cell spanning the columns.
