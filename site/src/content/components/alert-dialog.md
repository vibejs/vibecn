---
title: Alert Dialog
description: A modal dialog that interrupts the user with important content and expects a response.
---

<Example name="alert-dialog-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import AlertDialog from '@/components/ui/AlertDialog.vibe';
import AlertDialogAction from '@/components/ui/AlertDialogAction.vibe';
import AlertDialogCancel from '@/components/ui/AlertDialogCancel.vibe';
import AlertDialogContent from '@/components/ui/AlertDialogContent.vibe';
import AlertDialogDescription from '@/components/ui/AlertDialogDescription.vibe';
import AlertDialogFooter from '@/components/ui/AlertDialogFooter.vibe';
import AlertDialogHeader from '@/components/ui/AlertDialogHeader.vibe';
import AlertDialogTitle from '@/components/ui/AlertDialogTitle.vibe';
import AlertDialogTrigger from '@/components/ui/AlertDialogTrigger.vibe';
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger variant="outline">Show dialog</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction @click="remove">Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
```

Unlike a Dialog, an alert dialog has no close button and does not close on a click outside. The user answers with an action or cancels.

## Examples

### Small, with media

<Example name="alert-dialog-destructive" />

## API Reference

| Component                                                                                                  | Prop              | Type                | Default     |
| ---------------------------------------------------------------------------------------------------------- | ----------------- | ------------------- | ----------- |
| `AlertDialog`                                                                                              | `v-model:open`    | `boolean`           | `false`     |
| `AlertDialogContent`                                                                                       | `size`            | `'default' \| 'sm'` | `'default'` |
| `AlertDialogAction`                                                                                        | `variant`, `size` | Button props        | `'default'` |
| `AlertDialogCancel`                                                                                        | `variant`, `size` | Button props        | `'outline'` |
| `AlertDialogTrigger`                                                                                       | `variant`, `size` | Button props        | `'default'` |
| `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogMedia` |                   |                     |             |

`AlertDialogAction` and `AlertDialogCancel` close the dialog after your `@click` handler runs.

## Accessibility

The content has the `alertdialog` role and is named by its title and described by its description. <kbd>Escape</kbd> cancels.
