---
title: DragHandle
description: A native, keyboard-accessible button for drag activation.
---

<Example name="drag-handle-demo" />

## Installation

These compositions are included in this local registry build. Run the built local CLI with add drag-handle, then install the dependencies it reports. The current published release does not contain this work yet.

## Usage

```vibe
<script setup lang="ts">
import DragHandle from '@/components/ui/DragHandle.vibe';
</script>
<template><DragHandle label="Move task"/></template>
```

## API Reference

label names the native button. disabled prevents activation. The exposed element is its HTMLButtonElement. Connect that exposed element to useDraggable or useSortable; a handle alone does not create a drag interaction.

## Accessibility

Native buttons keep focus visible. Space/Enter pick up and drop; arrows navigate and Escape cancels. Handles use touch-action:none. VibeDND retains the built-in Accessibility plugin and leaves Vibe in control of keyed DOM order.
