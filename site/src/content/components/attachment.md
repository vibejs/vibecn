---
title: Attachment
description: Displays a file or image attached to a message, with its upload state and actions.
---

<Example name="attachment-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Attachment from '@/components/ui/Attachment.vibe';
import AttachmentContent from '@/components/ui/AttachmentContent.vibe';
import AttachmentDescription from '@/components/ui/AttachmentDescription.vibe';
import AttachmentMedia from '@/components/ui/AttachmentMedia.vibe';
import AttachmentTitle from '@/components/ui/AttachmentTitle.vibe';
</script>

<template>
  <Attachment state="uploading">
    <AttachmentMedia><svg>...</svg></AttachmentMedia>
    <AttachmentContent>
      <AttachmentTitle>report.pdf</AttachmentTitle>
      <AttachmentDescription>Uploading 64%</AttachmentDescription>
    </AttachmentContent>
  </Attachment>
</template>
```

The title shimmers while the state is `uploading` or `processing`. Add an `AttachmentTrigger` to make the whole attachment open a preview; it covers the attachment, and `AttachmentActions` stay above it.

## Examples

### Group

`AttachmentGroup` scrolls horizontally with snap points and fades its edges.

<Example name="attachment-group" />

## API Reference

| Component                                                                                                                    | Prop              | Type                                                         | Default                |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------ | ---------------------- |
| `Attachment`                                                                                                                 | `state`           | `'idle' \| 'uploading' \| 'processing' \| 'error' \| 'done'` | `'done'`               |
|                                                                                                                              | `size`            | `'default' \| 'sm' \| 'xs'`                                  | `'default'`            |
|                                                                                                                              | `orientation`     | `'horizontal' \| 'vertical'`                                 | `'horizontal'`         |
| `AttachmentMedia`                                                                                                            | `variant`         | `'icon' \| 'image'`                                          | `'icon'`               |
| `AttachmentAction`                                                                                                           | `variant`, `size` | Button props                                                 | `'ghost'`, `'icon-xs'` |
| `AttachmentGroup`, `AttachmentContent`, `AttachmentTitle`, `AttachmentDescription`, `AttachmentActions`, `AttachmentTrigger` |                   |                                                              |                        |

The shimmer and edge fade come from the `shimmer` and `scroll-fade-x` utilities in `vibecn.css`. Projects initialized before this version can copy them from the theme in the registry.

## Accessibility

`Attachment` sets `aria-busy` while uploading or processing. Give icon-only actions an `aria-label` that names the file, and give `AttachmentTrigger` one that says what it opens.
