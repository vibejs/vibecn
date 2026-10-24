---
title: Menubar
description: A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.
---

<Example name="menubar-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Menubar from '@/components/ui/Menubar.vibe';
import MenubarContent from '@/components/ui/MenubarContent.vibe';
import MenubarItem from '@/components/ui/MenubarItem.vibe';
import MenubarMenu from '@/components/ui/MenubarMenu.vibe';
import MenubarSeparator from '@/components/ui/MenubarSeparator.vibe';
import MenubarShortcut from '@/components/ui/MenubarShortcut.vibe';
import MenubarTrigger from '@/components/ui/MenubarTrigger.vibe';
</script>

<template>
  <Menubar aria-label="Editor">
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
        <MenubarItem>New Window</MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Share</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>
```

The menu parts mirror [Dropdown Menu](/docs/components/dropdown-menu).

## API Reference

| Component        | Prop                                         | Type                | Default                          |
| ---------------- | -------------------------------------------- | ------------------- | -------------------------------- |
| `MenubarMenu`    | `v-model:open`                               | `boolean`           | `false`                          |
| `MenubarTrigger` | `disabled`                                   | `boolean`           | `false`                          |
| `MenubarContent` | `side`, `align`, `sideOffset`, `alignOffset` | Like PopoverContent | `'bottom'`, `'start'`, `8`, `-4` |

## Accessibility

The bar is one stop in the tab order; <kbd>ArrowLeft</kbd> and <kbd>ArrowRight</kbd> move between its triggers, and <kbd>ArrowDown</kbd> opens a menu. With a menu open, <kbd>ArrowLeft</kbd> and <kbd>ArrowRight</kbd> move to the neighboring menu, and moving the pointer to another trigger opens its menu. Menus follow the WAI-ARIA menu pattern. The arrow keys move between items, <kbd>Home</kbd> and <kbd>End</kbd> go to the first and last, typing jumps to the item that starts with the typed text, and <kbd>Enter</kbd> or <kbd>Space</kbd> activates an item. <kbd>ArrowRight</kbd> opens a submenu and <kbd>ArrowLeft</kbd> closes it; <kbd>Escape</kbd> closes the menu and returns focus to where it was opened.
