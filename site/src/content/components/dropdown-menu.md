---
title: Dropdown Menu
description: Displays a menu to the user, such as a set of actions or functions, triggered by a button.
---

<Example name="dropdown-menu-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import DropdownMenu from '@/components/ui/DropdownMenu.vibe';
import DropdownMenuContent from '@/components/ui/DropdownMenuContent.vibe';
import DropdownMenuItem from '@/components/ui/DropdownMenuItem.vibe';
import DropdownMenuLabel from '@/components/ui/DropdownMenuLabel.vibe';
import DropdownMenuSeparator from '@/components/ui/DropdownMenuSeparator.vibe';
import DropdownMenuTrigger from '@/components/ui/DropdownMenuTrigger.vibe';
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger variant="outline">Open</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @select="openProfile">Profile</DropdownMenuItem>
      <DropdownMenuItem>Billing</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

Selecting an item emits `select` and closes the menu. Call `event.preventDefault()` in the listener to keep it open.

## Examples

### Checkboxes and radio items

<Example name="dropdown-menu-checkboxes" />

## API Reference

| Component                                                                                      | Prop                                         | Type                         | Default                         |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------- | ------------------------------- |
| `DropdownMenu`                                                                                 | `v-model:open`                               | `boolean`                    | `false`                         |
| `DropdownMenuTrigger`                                                                          | `variant`, `size`, `disabled`                | Button props                 | `'default'`                     |
| `DropdownMenuContent`                                                                          | `side`, `align`, `sideOffset`, `alignOffset` | Like PopoverContent          | `'bottom'`, `'start'`, `4`, `0` |
| `DropdownMenuItem`                                                                             | `variant`                                    | `'default' \| 'destructive'` | `'default'`                     |
|                                                                                                | `inset`, `disabled`                          | `boolean`                    | `false`                         |
|                                                                                                | `@select`                                    | `(event: Event) => void`     |                                 |
| `DropdownMenuCheckboxItem`                                                                     | `v-model:checked`                            | `boolean`                    | `false`                         |
| `DropdownMenuRadioGroup`                                                                       | `v-model`                                    | `string`                     | `''`                            |
| `DropdownMenuRadioItem`                                                                        | `value`                                      | `string`                     |                                 |
| `DropdownMenuSub`                                                                              | `v-model:open`                               | `boolean`                    | `false`                         |
| `DropdownMenuSubTrigger`                                                                       | `inset`, `disabled`                          | `boolean`                    | `false`                         |
| `DropdownMenuLabel`                                                                            | `inset`                                      | `boolean`                    | `false`                         |
| `DropdownMenuSubContent`, `DropdownMenuGroup`, `DropdownMenuSeparator`, `DropdownMenuShortcut` |                                              |                              |                                 |

## Accessibility

Menus follow the WAI-ARIA menu pattern. The arrow keys move between items, <kbd>Home</kbd> and <kbd>End</kbd> go to the first and last, typing jumps to the item that starts with the typed text, and <kbd>Enter</kbd> or <kbd>Space</kbd> activates an item. <kbd>ArrowRight</kbd> opens a submenu and <kbd>ArrowLeft</kbd> closes it; <kbd>Escape</kbd> closes the menu and returns focus to where it was opened. Opening the menu with the keyboard focuses its first item; <kbd>ArrowUp</kbd> on the trigger focuses the last.
