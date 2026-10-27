---
title: SortableGrid
description: A controlled sortable grid using VibeDND.
---

<Example name="sortable-grid-demo" />

## Installation

These compositions are included in this local registry build. Run the built local CLI with add sortable-grid, then install the dependencies it reports. The current published release does not contain this work yet.

## Usage

```vibe
<script setup lang="ts">
import {ref} from '@usevibejs/ui';
import type {SortableEntry} from '@/lib/dnd.ts';
import SortableGrid from '@/components/ui/SortableGrid.vibe';
const items=ref<SortableEntry[]>([{id:'one',label:'Revenue'},{id:'two',label:'Retention'},{id:'three',label:'Activity'},{id:'four',label:'Sessions'}]);
</script>
<template><SortableGrid v-model="items" class="w-full max-w-lg"/></template>
```

## API Reference

The model is an array of entries with stable id, label and optional disabled properties. The list creates a scoped manager and emits immutable final-drop updates. group identifies the list; orientation on SortableList accepts vertical, horizontal or grid.

## Accessibility

Native buttons keep focus visible. Space/Enter pick up and drop; arrows navigate and Escape cancels. Handles use touch-action:none. VibeDND retains the built-in Accessibility plugin and leaves Vibe in control of keyed DOM order.
