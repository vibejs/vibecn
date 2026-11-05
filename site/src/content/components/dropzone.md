---
title: Dropzone
description: An accessible file drop area that enforces the same limits as the vibe.js files() body.
---

<Example name="dropzone-demo" align="start" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Dropzone from '@/components/ui/Dropzone.vibe';

const body = ref<FormData | null>(null);
async function upload(files: File[]): Promise<void> {
  await fetch('/api/uploads', { method: 'POST', body: body.value });
  void files;
}
</script>

<template>
  <Dropzone
    v-model:form-data="body"
    :max-bytes="1_000_000"
    :max-files="4"
    :types="['image/png', 'image/*', '.txt']"
    :upload="upload"
    label="Upload files"
  />
</template>
```

Pass the same `maxBytes`, `maxFiles` and `types` the route declares with vibe.js `files({ maxBytes, maxFiles, types })`. This component does not import that server API. Post the `FormData` as the request body; the handler reads `ctx.files`.

An accepted selection always builds `FormData`. The field name is `name` (default `files`), with one part per file. When you pass `upload`, it is called with the accepted `File[]` after that. Omit `upload` when the caller only needs the body.

A file matches `types` when any entry matches. An entry is an extension (`.txt`), a MIME type (`image/png`) or a MIME prefix (`image/*`). An empty `types` list accepts every type. Omitting `maxBytes` or `maxFiles` does not enforce that limit here. More files than `maxFiles` rejects the whole selection. A file larger than `maxBytes`, or of a type that matches nothing, is listed in the alert and nothing is uploaded. Any rejection blocks the selection.

## API Reference

| Prop                | Type                               | Default                            |
| ------------------- | ---------------------------------- | ---------------------------------- |
| `v-model:form-data` | `FormData \| null`                 | `null`                             |
| `upload`            | `(files: File[]) => Promise<void>` |                                    |
| `maxBytes`          | `number`                           |                                    |
| `maxFiles`          | `number`                           |                                    |
| `types`             | `readonly string[]`                | `[]`                               |
| `name`              | `string`                           | `files`                            |
| `label`             | `string`                           | `Upload files`                     |
| `description`       | `string`                           | `Drop files here, or choose them.` |
| `disabled`          | `boolean`                          | `false`                            |
| `class`             | `ClassValue`                       |                                    |

## Accessibility

The file input is labelled and stays in the accessibility tree. `accept` mirrors `types`. `multiple` is set unless `maxFiles` is 1. Rejection reasons are an alert, pointed at by `aria-describedby`, and the input is `aria-invalid`. Dragging and uploading expose a status. The control disables while a passed `upload` is in progress.
