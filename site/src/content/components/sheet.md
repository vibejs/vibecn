---
title: Sheet
description: Extends the Dialog component to display content that complements the main content of the screen.
---

<Example name="sheet-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Sheet from '@/components/ui/Sheet.vibe';
import SheetContent from '@/components/ui/SheetContent.vibe';
import SheetDescription from '@/components/ui/SheetDescription.vibe';
import SheetHeader from '@/components/ui/SheetHeader.vibe';
import SheetTitle from '@/components/ui/SheetTitle.vibe';
import SheetTrigger from '@/components/ui/SheetTrigger.vibe';
</script>

<template>
  <Sheet>
    <SheetTrigger>Open</SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Are you absolutely sure?</SheetTitle>
        <SheetDescription>This action cannot be undone.</SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
```

## Examples

### Side

<Example name="sheet-side" />

## API Reference

| Component                                                      | Prop              | Type                                     | Default   |
| -------------------------------------------------------------- | ----------------- | ---------------------------------------- | --------- |
| `Sheet`                                                        | `v-model:open`    | `boolean`                                | `false`   |
| `SheetContent`                                                 | `side`            | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
|                                                                | `showCloseButton` | `boolean`                                | `true`    |
| `SheetTrigger`, `SheetClose`                                   | `variant`, `size` | Button props                             |           |
| `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription` |                   |                                          |           |

Change the width with a class, such as `class="w-[400px] sm:max-w-[540px]"`.

## Accessibility

A sheet is a modal dialog: focus moves into it and stays there, <kbd>Escape</kbd> and a click outside close it, and focus returns to the trigger.
