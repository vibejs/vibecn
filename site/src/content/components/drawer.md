---
title: Drawer
description: A drawer component for vibe.js that slides in from an edge and can be dragged closed.
---

<Example name="drawer-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Drawer from '@/components/ui/Drawer.vibe';
import DrawerClose from '@/components/ui/DrawerClose.vibe';
import DrawerContent from '@/components/ui/DrawerContent.vibe';
import DrawerDescription from '@/components/ui/DrawerDescription.vibe';
import DrawerFooter from '@/components/ui/DrawerFooter.vibe';
import DrawerHeader from '@/components/ui/DrawerHeader.vibe';
import DrawerTitle from '@/components/ui/DrawerTitle.vibe';
import DrawerTrigger from '@/components/ui/DrawerTrigger.vibe';
</script>

<template>
  <Drawer>
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <DrawerClose>Cancel</DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
```

A bottom drawer shows a handle. Dragging the handle down by more than a quarter of the drawer's height closes it.

## API Reference

| Component                                                          | Prop              | Type                                     | Default    |
| ------------------------------------------------------------------ | ----------------- | ---------------------------------------- | ---------- |
| `Drawer`                                                           | `v-model:open`    | `boolean`                                | `false`    |
| `DrawerContent`                                                    | `direction`       | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` |
| `DrawerTrigger`, `DrawerClose`                                     | `variant`, `size` | Button props                             |            |
| `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription` |                   |                                          |            |

The upstream drawer is built on vaul, with snap points and scaling of the page behind it. This port keeps the panel, the handle and drag to close; snap points are not included.

## Accessibility

The drawer is a modal dialog. Dragging is an addition: <kbd>Escape</kbd>, a click outside and `DrawerClose` also close it.
