---
title: Message Scroller
description: A scrolling conversation that stays at the newest message while it is read live.
---

<Example name="message-scroller-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import MessageScroller from '@/components/ui/MessageScroller.vibe';
import MessageScrollerButton from '@/components/ui/MessageScrollerButton.vibe';
import MessageScrollerContent from '@/components/ui/MessageScrollerContent.vibe';
import MessageScrollerItem from '@/components/ui/MessageScrollerItem.vibe';
import MessageScrollerViewport from '@/components/ui/MessageScrollerViewport.vibe';
</script>

<template>
  <MessageScroller class="h-96">
    <MessageScrollerViewport aria-label="Conversation">
      <MessageScrollerContent>
        <MessageScrollerItem v-for="message in messages" :key="message.id">...</MessageScrollerItem>
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</template>
```

The viewport starts at the end. While the reader is at the end, growing content, such as a streamed reply, keeps it there; once they scroll up, it stays where they are, and `MessageScrollerButton` appears to jump back. Set `scrollAnchor` on an item to scroll it to the top when it appears, such as the question a reply answers.

## API Reference

| Component                                                              | Prop              | Type               | Default                    |
| ---------------------------------------------------------------------- | ----------------- | ------------------ | -------------------------- |
| `MessageScrollerItem`                                                  | `scrollAnchor`    | `boolean`          | `false`                    |
| `MessageScrollerButton`                                                | `direction`       | `'start' \| 'end'` | `'end'`                    |
|                                                                        | `variant`, `size` | Button props       | `'secondary'`, `'icon-sm'` |
| `MessageScroller`, `MessageScrollerViewport`, `MessageScrollerContent` |                   |                    |                            |

Items use `content-visibility: auto`, so long conversations render only what is near the view. The upstream provider and hooks are not included.

## Accessibility

The viewport is focusable and scrolls with the keyboard; name it with `aria-label`. The button is hidden from assistive technology and the tab order while there is nothing to scroll to.
