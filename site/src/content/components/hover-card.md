---
title: Hover Card
description: For sighted users to preview content available behind a link.
---

<Example name="hover-card-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import HoverCard from '@/components/ui/HoverCard.vibe';
import HoverCardContent from '@/components/ui/HoverCardContent.vibe';
import HoverCardTrigger from '@/components/ui/HoverCardTrigger.vibe';
</script>

<template>
  <HoverCard>
    <HoverCardTrigger href="https://vibejs.org">vibe.js</HoverCardTrigger>
    <HoverCardContent>The TypeScript framework for full-stack apps.</HoverCardContent>
  </HoverCard>
</template>
```

## API Reference

| Component          | Prop                                         | Type                | Default                          |
| ------------------ | -------------------------------------------- | ------------------- | -------------------------------- |
| `HoverCard`        | `v-model:open`                               | `boolean`           | `false`                          |
|                    | `openDelay`                                  | `number`            | `700`                            |
|                    | `closeDelay`                                 | `number`            | `300`                            |
| `HoverCardTrigger` | `href`, `target`, `rel`                      |                     |                                  |
| `HoverCardContent` | `side`, `align`, `sideOffset`, `alignOffset` | Like PopoverContent | `'bottom'`, `'center'`, `4`, `0` |

The card stays open while the pointer is over the trigger or the card.

## Accessibility

A hover card is for previews only: the link itself must lead to the same content. Keyboard users open it by focusing the link.
