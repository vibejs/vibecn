---
title: Accordion
description: A vertically stacked set of interactive headings that each reveal a section of content.
---

<Example name="accordion-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Accordion from '@/components/ui/Accordion.vibe';
import AccordionContent from '@/components/ui/AccordionContent.vibe';
import AccordionItem from '@/components/ui/AccordionItem.vibe';
import AccordionTrigger from '@/components/ui/AccordionTrigger.vibe';
</script>

<template>
  <Accordion>
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>Yes. It uses native disclosure elements.</AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
```

Each item is a native `<details>` element and each trigger its `<summary>`. Items of a single accordion share a name, so the browser closes the others when one opens. Find in page opens the item that contains a match.

## Examples

### Multiple

<Example name="accordion-multiple" />

## API Reference

| Component                              | Prop             | Type                     | Default    |
| -------------------------------------- | ---------------- | ------------------------ | ---------- |
| `Accordion`                            | `type`           | `'single' \| 'multiple'` | `'single'` |
|                                        | `v-model`        | `string`                 | `''`       |
|                                        | `v-model:values` | `string[]`               | `[]`       |
| `AccordionItem`                        | `value`          | `string`                 |            |
|                                        | `disabled`       | `boolean`                | `false`    |
| `AccordionTrigger`, `AccordionContent` |                  |                          |            |

Use `v-model` with `type="single"` and `v-model:values` with `type="multiple"`. An open single item can always be closed again.

## Accessibility

Triggers are focusable and toggle with <kbd>Enter</kbd> and <kbd>Space</kbd>; screen readers announce them as expanded or collapsed. Opening animates where the browser supports animating `::details-content`, and not at all when reduced motion is preferred.
