---
title: DropZone
description: A measured drop target with explicit type eligibility.
---

<Example name="drop-zone-demo" />

## Installation

These compositions are included in this local registry build. Run the built local CLI with add drop-zone, then install the dependencies it reports. The current published release does not contain this work yet.

## Usage

```vibe
<script setup lang="ts">
import {useDnd} from '@usevibejs/dnd';
import DropZone from '@/components/ui/DropZone.vibe';
useDnd();
</script>
<template><DropZone id="demo-zone" class="w-full max-w-sm">Drop an accepted item here</DropZone></template>
```

## API Reference

id identifies the target. accept is an engine type or array of types. disabled rejects drops. Render within an ancestor useDnd context; the scoped default slot receives isOver and isEligible.

## Accessibility

Native buttons keep focus visible. Space/Enter pick up and drop; arrows navigate and Escape cancels. Handles use touch-action:none. VibeDND retains the built-in Accessibility plugin and leaves Vibe in control of keyed DOM order.
