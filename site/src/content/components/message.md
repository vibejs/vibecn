---
title: Message
description: Lays out a chat message with its avatar, header, content and footer.
---

<Example name="message-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Bubble from '@/components/ui/Bubble.vibe';
import BubbleContent from '@/components/ui/BubbleContent.vibe';
import Message from '@/components/ui/Message.vibe';
import MessageContent from '@/components/ui/MessageContent.vibe';
import MessageFooter from '@/components/ui/MessageFooter.vibe';
</script>

<template>
  <Message align="end">
    <MessageContent>
      <Bubble><BubbleContent>Deploying now.</BubbleContent></Bubble>
      <MessageFooter>Read 09:42</MessageFooter>
    </MessageContent>
  </Message>
</template>
```

## API Reference

| Component                                                                           | Prop    | Type               | Default   |
| ----------------------------------------------------------------------------------- | ------- | ------------------ | --------- |
| `Message`                                                                           | `align` | `'start' \| 'end'` | `'start'` |
| `MessageGroup`, `MessageAvatar`, `MessageContent`, `MessageHeader`, `MessageFooter` |         |                    |           |

`align="end"` reverses the row, for the reader's own messages.
