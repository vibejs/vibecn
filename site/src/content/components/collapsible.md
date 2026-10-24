---
title: Collapsible
description: An interactive component which expands and collapses a panel.
---

<Example name="collapsible-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Collapsible from '@/components/ui/Collapsible.vibe';
import CollapsibleContent from '@/components/ui/CollapsibleContent.vibe';
import CollapsibleTrigger from '@/components/ui/CollapsibleTrigger.vibe';
</script>

<template>
  <Collapsible>
    <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
    <CollapsibleContent>Yes. Free to use for personal and commercial projects.</CollapsibleContent>
  </Collapsible>
</template>
```

## API Reference

| Component            | Prop                          | Type         | Default   |
| -------------------- | ----------------------------- | ------------ | --------- |
| `Collapsible`        | `v-model:open`                | `boolean`    | `false`   |
| `CollapsibleTrigger` | `variant`, `size`, `disabled` | Button props | `'ghost'` |
| `CollapsibleContent` |                               |              |           |

## Accessibility

The trigger is a button with `aria-expanded` and `aria-controls`. Closed content is `hidden="until-found"`: find in page still finds its text and opens the collapsible.
