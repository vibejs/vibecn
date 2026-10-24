---
title: Bubble
description: A chat bubble that holds the content of a message.
---

<Example name="bubble-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Bubble from '@/components/ui/Bubble.vibe';
import BubbleContent from '@/components/ui/BubbleContent.vibe';
</script>

<template>
  <Bubble variant="muted">
    <BubbleContent>Did the build pass?</BubbleContent>
  </Bubble>
</template>
```

Inside a `Message` with `align="end"`, bubbles align to the end on their own.

## API Reference

| Component                      | Prop      | Type                                                                                       | Default     |
| ------------------------------ | --------- | ------------------------------------------------------------------------------------------ | ----------- |
| `Bubble`                       | `variant` | `'default' \| 'secondary' \| 'muted' \| 'tinted' \| 'outline' \| 'ghost' \| 'destructive'` | `'default'` |
|                                | `align`   | `'start' \| 'end'`                                                                         | `'start'`   |
| `BubbleReactions`              | `side`    | `'top' \| 'bottom'`                                                                        | `'bottom'`  |
|                                | `align`   | `'start' \| 'end'`                                                                         | `'end'`     |
| `BubbleGroup`, `BubbleContent` |           |                                                                                            |             |

`BubbleContent` renders a `<div>`. For a clickable bubble, put a `<button>` or `<a>` with the same classes inside `Bubble`; the variants style its hover state.

## Accessibility

Reactions that use emoji need an accessible label that says what they mean, such as `aria-label="Reactions: thumbs up, 2"`.
