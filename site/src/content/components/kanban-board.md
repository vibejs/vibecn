---
title: KanbanBoard
description: Controlled card transfers between columns, including empty columns.
---

<Example name="kanban-board-demo" />

## Installation

These compositions are included in this local registry build. Run the built local CLI with add kanban-board, then install the dependencies it reports. The current published release does not contain this work yet.

## Usage

```vibe
<script setup lang="ts">
import {ref} from '@usevibejs/ui';
import type {KanbanColumn} from '@/lib/dnd.ts';
import KanbanBoard from '@/components/ui/KanbanBoard.vibe';
const columns=ref<KanbanColumn[]>([{id:'todo',title:'To do',items:[{id:'task-a',label:'Design the interaction'},{id:'task-b',label:'Test the keyboard flow'}]},{id:'done',title:'Done',items:[]}]);
</script>
<template><KanbanBoard v-model="columns" class="w-full"/></template>
```

## API Reference

The model is an array of columns with stable string id, title and items. Item IDs must be unique across columns. Use the model update to persist accepted moves. Cross-container transfers remount item components through the Vibe renderer.

## Accessibility

Native buttons keep focus visible. Space/Enter pick up and drop; arrows navigate and Escape cancels. Handles use touch-action:none. VibeDND retains the built-in Accessibility plugin and leaves Vibe in control of keyed DOM order.
