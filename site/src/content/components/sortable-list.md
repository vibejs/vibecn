---
title: SortableList
description: A controlled sortable list using VibeDND.
---

<Example name="sortable-list-demo" />

## Installation

These compositions are included in this local registry build. Run the built local CLI with add sortable-list, then install the dependencies it reports. The current published release does not contain this work yet.

## Usage

```vibe
<script setup lang="ts">
import {ref} from '@usevibejs/ui';
import type {SortableEntry} from '@/lib/dnd.ts';
import SortableList from '@/components/ui/SortableList.vibe';
const items=ref<SortableEntry[]>([{id:'plan',label:'Plan the release'},{id:'build',label:'Build the feature'},{id:'ship',label:'Ship it'}]);
</script>
<template><SortableList v-model="items" class="w-full max-w-sm"/></template>
```

## API Reference

The model is an array of entries with stable id, label and optional disabled properties. The list creates a scoped manager and emits immutable final-drop updates. group identifies the list; orientation on SortableList accepts vertical, horizontal or grid.

## Accessibility

Native buttons keep focus visible. Space/Enter pick up and drop; arrows navigate and Escape cancels. Handles use touch-action:none. VibeDND retains the built-in Accessibility plugin and leaves Vibe in control of keyed DOM order.
