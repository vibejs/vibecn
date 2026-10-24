---
title: Navigation Menu
description: A collection of links for navigating websites.
---

<Example name="navigation-menu-demo" align="start" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import NavigationMenu from '@/components/ui/NavigationMenu.vibe';
import NavigationMenuContent from '@/components/ui/NavigationMenuContent.vibe';
import NavigationMenuItem from '@/components/ui/NavigationMenuItem.vibe';
import NavigationMenuLink from '@/components/ui/NavigationMenuLink.vibe';
import NavigationMenuList from '@/components/ui/NavigationMenuList.vibe';
import NavigationMenuTrigger from '@/components/ui/NavigationMenuTrigger.vibe';
</script>

<template>
  <NavigationMenu aria-label="Main">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink href="/one">Link</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="/docs" variant="trigger">Docs</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
```

Content opens below its trigger on hover, after a short delay, or on click. Moving from one open item to another switches at once. Use `variant="trigger"` for a top-level link, where upstream uses `navigationMenuTriggerStyle()`.

## API Reference

| Component                                     | Prop            | Type                     | Default     |
| --------------------------------------------- | --------------- | ------------------------ | ----------- |
| `NavigationMenu`                              | `v-model`       | `string`                 | `''`        |
|                                               | `delayDuration` | `number`                 | `200`       |
|                                               | `closeDelay`    | `number`                 | `300`       |
| `NavigationMenuItem`                          | `value`         | `string`                 | generated   |
| `NavigationMenuTrigger`                       | `disabled`      | `boolean`                | `false`     |
| `NavigationMenuLink`                          | `href`          | `string`                 |             |
|                                               | `active`        | `boolean`                | `false`     |
|                                               | `variant`       | `'default' \| 'trigger'` | `'default'` |
| `NavigationMenuList`, `NavigationMenuContent` |                 |                          |             |

Each content panel opens below its own item. The shared animated viewport and indicator of the upstream component are not included.

## Accessibility

Triggers are buttons that report whether their content is expanded. <kbd>Enter</kbd> or <kbd>Space</kbd> toggles a panel, <kbd>ArrowDown</kbd> opens it and focuses its first link, <kbd>Tab</kbd> moves through the links in order and <kbd>Escape</kbd> closes it. Focus or a press outside the menu closes it.
