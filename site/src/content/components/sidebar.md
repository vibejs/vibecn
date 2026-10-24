---
title: Sidebar
description: A composable sidebar with desktop collapse modes and a mobile Sheet.
---

<Example name="sidebar-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import SidebarProvider from '@/components/ui/SidebarProvider.vibe';
import Sidebar from '@/components/ui/Sidebar.vibe';
import SidebarContent from '@/components/ui/SidebarContent.vibe';
import SidebarInset from '@/components/ui/SidebarInset.vibe';
import SidebarTrigger from '@/components/ui/SidebarTrigger.vibe';
</script>

<template>
  <SidebarProvider storage-key="app-sidebar">
    <Sidebar collapsible="icon">
      <SidebarContent>Your navigation</SidebarContent>
    </Sidebar>
    <SidebarInset>
      <SidebarTrigger />
      Your application
    </SidebarInset>
  </SidebarProvider>
</template>
```

Place the provider around the application shell. On desktop the sidebar is fixed and
reserves a matching gap. The example overrides fixed positioning to keep the preview inside
its frame; omit those classes in your application. Customize widths with `--sidebar-width`
and `--sidebar-width-icon` and colors with the `--sidebar-*` theme tokens.

## Examples

Use `collapsible="offcanvas"` to move the whole sidebar out of view, `"icon"` for an icon
rail, or `"none"` for a permanently visible panel. Add meaningful icons and accessible names
to menu buttons when using icon mode. `variant="floating"` gives the sidebar a bordered
card; `"inset"` styles the neighboring SidebarInset.

Compose SidebarHeader, SidebarContent and SidebarFooter, then add SidebarGroup,
SidebarGroupLabel, SidebarGroupContent, SidebarMenu and SidebarMenuItem. SidebarMenuButton
is an action button; SidebarMenuLink is a native link. SidebarMenuSub, SidebarMenuSubItem
and SidebarMenuSubButton compose nested navigation links.

SidebarGroupAction and SidebarMenuAction are native action buttons. Label icon-only actions
with `aria-label`. SidebarMenuBadge displays a count, SidebarMenuSkeleton a loading row,
SidebarInput a search field, and SidebarSeparator divides sections.

## API Reference

| Component                                 | Prop                    | Type                                 | Default         |
| ----------------------------------------- | ----------------------- | ------------------------------------ | --------------- |
| `SidebarProvider`                         | `v-model:open`          | `boolean`                            | `true`          |
|                                           | `v-model:openMobile`    | `boolean`                            | `false`         |
|                                           | `storageKey`            | `string`                             | No persistence  |
| `Sidebar`                                 | `side`                  | `'left' \| 'right'`                  | `'left'`        |
|                                           | `variant`               | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'`     |
|                                           | `collapsible`           | `'offcanvas' \| 'icon' \| 'none'`    | `'offcanvas'`   |
|                                           | `label`                 | `string`                             | `'Sidebar'`     |
| `SidebarMenuButton`, `SidebarMenuLink`    | `isActive`              | `boolean`                            | `false`         |
|                                           | `variant`               | `'default' \| 'outline'`             | `'default'`     |
|                                           | `size`                  | `'default' \| 'sm' \| 'lg'`          | `'default'`     |
|                                           | `tooltip`               | `string` (native title)              |                 |
| `SidebarMenuLink`, `SidebarMenuSubButton` | `href`, `target`, `rel` | Native link attributes               |                 |
| `SidebarMenuSubButton`                    | `size`, `isActive`      | `'sm' \| 'md'`, `boolean`            | `'md'`, `false` |
| `SidebarMenuAction`                       | `showOnHover`           | `boolean`                            | `false`         |
| `SidebarMenuSkeleton`                     | `showIcon`              | `boolean`                            | `false`         |
| `SidebarInput`                            | `v-model`               | `string`                             | `''`            |
| `SidebarTrigger`, `SidebarRail`           | `@click`                | `(event: MouseEvent) => void`        |                 |

All visual parts accept `class` and forward native attributes and listeners. Cancel a
trigger or rail click with `event.preventDefault()`. Desktop state is read and written to
localStorage only when `storageKey` is supplied. Unavailable storage does not prevent use.
Persistence intentionally takes precedence over the initial desktop model value.

This port uses localStorage instead of the upstream cookie and uses native `title` hints
instead of a wrapped tooltip. `asChild` is not supported. Use SidebarMenuLink for links.
Skeleton width is deterministic. Use your own Collapsible composition for expanding groups.

## Accessibility

Sidebar renders a labeled aside on desktop. Trigger reports `aria-expanded` and
`aria-controls`. Offcanvas content is inert while collapsed. Below 768px, collapsible modes
use a labeled Sheet with focus trapping, Escape dismissal, a close button and focus
restoration. Desktop and mobile open states are independent; changing breakpoint closes
the mobile Sheet. Navigation actions can close it through `v-model:openMobile`.

⌘B or Ctrl+B toggles the active viewport's state. The shortcut leaves text inputs and
editable content alone. SidebarRail is a pointer target; SidebarTrigger is its keyboard
equivalent. Menu parts are ordinary lists, links and buttons rather than an ARIA menu.
