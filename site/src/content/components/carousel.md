---
title: Carousel
description: A native scroll-snap carousel with previous and next controls and keyboard navigation.
---

<Example name="carousel-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Carousel from '@/components/ui/Carousel.vibe';
import CarouselContent from '@/components/ui/CarouselContent.vibe';
import CarouselItem from '@/components/ui/CarouselItem.vibe';
import CarouselPrevious from '@/components/ui/CarouselPrevious.vibe';
import CarouselNext from '@/components/ui/CarouselNext.vibe';
</script>

<template>
  <Carousel label="Featured products">
    <CarouselContent>
      <CarouselItem>First slide</CarouselItem>
      <CarouselItem>Second slide</CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
```

Leave room around the carousel for its controls. Slides occupy the full viewport by default.
Use item classes such as `basis-1/2` to show more than one at a time. The model is the index
of the first slide nearest the start of the viewport, so partially visible slides remain
ordinary, scrollable content.

## Examples

### Vertical

Set a height on CarouselContent and use `orientation="vertical"`.

<Example name="carousel-vertical" />

## API Reference

| Component                          | Prop                          | Type                               | Default                        |
| ---------------------------------- | ----------------------------- | ---------------------------------- | ------------------------------ |
| `Carousel`                         | `v-model:index`               | `number` (zero-based)              | `0`                            |
|                                    | `orientation`                 | `'horizontal' \| 'vertical'`       | `'horizontal'`                 |
|                                    | `label`                       | `string`                           | `'Slides'`                     |
|                                    | default slot                  | `{ index: number; count: number }` |                                |
| `CarouselPrevious`, `CarouselNext` | `variant`, `size`, `disabled` | Button props                       | `'outline'`, `'icon'`, `false` |
| `CarouselContent`, `CarouselItem`  | `class`                       | `ClassValue`                       |                                |

Carousel exposes `previous()` and `next()` methods. External index changes scroll into view;
pointer scrolling updates the index. Added and removed slides update the count and labels.

This implementation uses CSS scroll snapping and `scrollIntoView`, without Embla. Looping,
autoplay, plugins, `opts` and `setApi` are not supported. Smooth scrolling respects reduced
motion. Controls use physical arrows; RTL mirroring is outside this version's API.

## Accessibility

The labeled region uses `aria-roledescription="carousel"`. Each slide is a group with
`aria-roledescription="slide"` and an index such as “2 of 5”. A live region announces the
active index. Native controls stay focused when activated, and disable at the ends.
Focus the content and use Left/Right, or Up/Down for a vertical carousel. Inputs and editable
content retain their normal arrow-key behavior. There is no automatic rotation.
