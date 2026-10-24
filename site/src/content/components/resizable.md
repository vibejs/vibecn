---
title: Resizable
description: Accessible resizable panel groups and layouts with keyboard support.
---

<Example name="resizable-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import ResizableHandle from '@/components/ui/ResizableHandle.vibe';
import ResizablePanel from '@/components/ui/ResizablePanel.vibe';
import ResizablePanelGroup from '@/components/ui/ResizablePanelGroup.vibe';
</script>

<template>
  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel>One</ResizablePanel>
    <ResizableHandle />
    <ResizablePanel>Two</ResizablePanel>
  </ResizablePanelGroup>
</template>
```

## Examples

### Handle

<Example name="resizable-handle" />

## API Reference

| Component             | Prop          | Type                         | Default         |
| --------------------- | ------------- | ---------------------------- | --------------- |
| `ResizablePanelGroup` | `direction`   | `'horizontal' \| 'vertical'` | `'horizontal'`  |
|                       | `@layout`     | `(sizes: number[]) => void`  |                 |
| `ResizablePanel`      | `defaultSize` | `number`                     | shares the rest |
|                       | `minSize`     | `number`                     | `0`             |
|                       | `maxSize`     | `number`                     | `100`           |
| `ResizableHandle`     | `withHandle`  | `boolean`                    | `false`         |

Sizes are percentages of the group. A handle resizes the panels directly before and after it.

## Accessibility

Each handle is a focusable `separator` that reports the size of the panel before it. The arrow keys resize by 5%, and <kbd>Home</kbd> and <kbd>End</kbd> collapse and expand the panel within its limits. Name each handle with `aria-label`.
