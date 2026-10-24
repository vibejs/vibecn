---
title: Dialog
description: A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
---

<Example name="dialog-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Dialog from '@/components/ui/Dialog.vibe';
import DialogContent from '@/components/ui/DialogContent.vibe';
import DialogDescription from '@/components/ui/DialogDescription.vibe';
import DialogHeader from '@/components/ui/DialogHeader.vibe';
import DialogTitle from '@/components/ui/DialogTitle.vibe';
import DialogTrigger from '@/components/ui/DialogTrigger.vibe';
</script>

<template>
  <Dialog>
    <DialogTrigger variant="outline">Open</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>
```

`DialogContent` is a native `<dialog>` opened with `showModal()`. It renders in the browser's top layer, so it needs no portal and is never clipped by a parent's `overflow`.

### Controlled

Bind `v-model:open` to open and close the dialog from your code, for example after a form is saved:

```vibe
<Dialog v-model:open="open">
  <DialogContent>
    <form @submit.prevent="save().then(() => (open = false))">...</form>
  </DialogContent>
</Dialog>
```

## Examples

### Close button in the footer

<Example name="dialog-close-button" />

## API Reference

| Component                                          | Prop                          | Type         | Default                  |
| -------------------------------------------------- | ----------------------------- | ------------ | ------------------------ |
| `Dialog`                                           | `v-model:open`                | `boolean`    | `false`                  |
| `DialogTrigger`, `DialogClose`                     | `variant`, `size`, `disabled` | Button props | `'default'`, `'outline'` |
| `DialogContent`                                    | `showCloseButton`             | `boolean`    | `true`                   |
|                                                    | `dismissible`                 | `boolean`    | `true`                   |
| `DialogFooter`                                     | `showCloseButton`             | `boolean`    | `false`                  |
| `DialogHeader`, `DialogTitle`, `DialogDescription` |                               |              |                          |

`DialogTrigger` and `DialogClose` render a `Button`. `dismissible` controls whether a click outside the content closes the dialog.

## Accessibility

- The browser moves focus into the dialog, keeps it there, closes the dialog on <kbd>Escape</kbd> and returns focus to the trigger.
- The page behind the dialog is inert and does not scroll.
- `DialogTitle` and `DialogDescription` name and describe the dialog. Always include a title; hide it with `class="sr-only"` if it should not be visible.
