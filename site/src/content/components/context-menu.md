---
title: Context Menu
description: Displays a menu to the user, such as a set of actions or functions, triggered by a right click.
---

<Example name="context-menu-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import ContextMenu from '@/components/ui/ContextMenu.vibe';
import ContextMenuContent from '@/components/ui/ContextMenuContent.vibe';
import ContextMenuItem from '@/components/ui/ContextMenuItem.vibe';
import ContextMenuTrigger from '@/components/ui/ContextMenuTrigger.vibe';
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>Right click</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>Profile</ContextMenuItem>
      <ContextMenuItem>Billing</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
```

The menu opens at the pointer. The parts mirror [Dropdown Menu](/docs/components/dropdown-menu): items, checkbox and radio items, labels, separators, shortcuts and submenus.

## API Reference

| Component            | Prop           | Type      | Default |
| -------------------- | -------------- | --------- | ------- |
| `ContextMenu`        | `v-model:open` | `boolean` | `false` |
| `ContextMenuTrigger` | `disabled`     | `boolean` | `false` |

The other parts take the same props as their Dropdown Menu counterparts.

## Accessibility

The menu opens with a right click, a long press where the platform reports one as a context menu, and the keyboard's context menu key or <kbd>Shift</kbd> <kbd>F10</kbd> while an element in the area has focus. Menus follow the WAI-ARIA menu pattern. The arrow keys move between items, <kbd>Home</kbd> and <kbd>End</kbd> go to the first and last, typing jumps to the item that starts with the typed text, and <kbd>Enter</kbd> or <kbd>Space</kbd> activates an item. <kbd>ArrowRight</kbd> opens a submenu and <kbd>ArrowLeft</kbd> closes it; <kbd>Escape</kbd> closes the menu and returns focus to where it was opened.
