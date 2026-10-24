---
title: Command
description: A fast command menu that filters a list as you type.
---

<Example name="command-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Command from '@/components/ui/Command.vibe';
import CommandEmpty from '@/components/ui/CommandEmpty.vibe';
import CommandGroup from '@/components/ui/CommandGroup.vibe';
import CommandInput from '@/components/ui/CommandInput.vibe';
import CommandItem from '@/components/ui/CommandItem.vibe';
import CommandList from '@/components/ui/CommandList.vibe';
import CommandSeparator from '@/components/ui/CommandSeparator.vibe';
</script>

<template>
  <Command>
    <CommandInput placeholder="Type a command or search..." aria-label="Command" />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem @select="run">Calendar</CommandItem>
        <CommandItem @select="run">Search Emoji</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem @select="run">Profile</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
```

An item matches when its text, or its `value` and `keywords`, contain the search. Groups without a visible item, and separators while searching, hide themselves.

## Examples

### Dialog

`CommandDialog` puts the command menu in a [Dialog](/docs/components/dialog). Bind a keyboard shortcut to open it.

<Example name="command-dialog" />

## API Reference

| Component                                                            | Prop                      | Type                      | Default            |
| -------------------------------------------------------------------- | ------------------------- | ------------------------- | ------------------ |
| `Command`                                                            | `v-model:search`          | `string`                  | `''`               |
| `CommandDialog`                                                      | `v-model:open`            | `boolean`                 | `false`            |
|                                                                      | `title`, `description`    | `string`                  | For screen readers |
|                                                                      | `showCloseButton`         | `boolean`                 | `true`             |
| `CommandInput`                                                       | `placeholder`, `disabled` |                           |                    |
| `CommandItem`                                                        | `value`                   | `string`                  | The item's text    |
|                                                                      | `keywords`                | `string[]`                | `[]`               |
|                                                                      | `disabled`                | `boolean`                 | `false`            |
|                                                                      | `@select`                 | `(value: string) => void` |                    |
| `CommandGroup`                                                       | `heading`                 | `string`                  |                    |
| `CommandList`, `CommandEmpty`, `CommandSeparator`, `CommandShortcut` |                           |                           |                    |

The upstream cmdk library ranks results by a fuzzy score. This port filters by substring and keeps your order.

## Accessibility

Focus stays in the input. <kbd>ArrowDown</kbd> and <kbd>ArrowUp</kbd> move the active item, which the input reports with `aria-activedescendant`, and <kbd>Enter</kbd> selects it.
