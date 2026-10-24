---
title: Table
description: A responsive table component.
---

<Example name="table-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Table from '@/components/ui/Table.vibe';
import TableBody from '@/components/ui/TableBody.vibe';
import TableCaption from '@/components/ui/TableCaption.vibe';
import TableCell from '@/components/ui/TableCell.vibe';
import TableHead from '@/components/ui/TableHead.vibe';
import TableHeader from '@/components/ui/TableHeader.vibe';
import TableRow from '@/components/ui/TableRow.vibe';
</script>

<template>
  <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead class="text-right">Amount</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>INV001</TableCell>
        <TableCell class="text-right">$250.00</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
```

`Table` wraps the `<table>` in a container that scrolls horizontally on small screens.

## API Reference

| Component      | Element     | Props                         |
| -------------- | ----------- | ----------------------------- |
| `Table`        | `<table>`   |                               |
| `TableHeader`  | `<thead>`   |                               |
| `TableBody`    | `<tbody>`   |                               |
| `TableFooter`  | `<tfoot>`   |                               |
| `TableRow`     | `<tr>`      |                               |
| `TableHead`    | `<th>`      | `colspan`, `rowspan`, `scope` |
| `TableCell`    | `<td>`      | `colspan`, `rowspan`          |
| `TableCaption` | `<caption>` |                               |

Set `data-state="selected"` on a `TableRow` to highlight it.
