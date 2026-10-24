---
title: Card
description: Displays a card with a header, content and footer.
---

<Example name="card-demo" />

## Installation

<Installation />

## Usage

Each part is its own component. Import the ones you need.

```vibe
<script setup lang="ts">
import Card from '@/components/ui/Card.vibe';
import CardAction from '@/components/ui/CardAction.vibe';
import CardContent from '@/components/ui/CardContent.vibe';
import CardDescription from '@/components/ui/CardDescription.vibe';
import CardFooter from '@/components/ui/CardFooter.vibe';
import CardHeader from '@/components/ui/CardHeader.vibe';
import CardTitle from '@/components/ui/CardTitle.vibe';
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
      <CardAction>Card Action</CardAction>
    </CardHeader>
    <CardContent>
      <p>Card Content</p>
    </CardContent>
    <CardFooter>
      <p>Card Footer</p>
    </CardFooter>
  </Card>
</template>
```

## Examples

### Statistic

<Example name="card-stats" />

## API Reference

| Component         | Element | Notes                                                    |
| ----------------- | ------- | -------------------------------------------------------- |
| `Card`            | `<div>` | The container.                                           |
| `CardHeader`      | `<div>` | A grid that places `CardAction` in the top-right corner. |
| `CardTitle`       | `<h3>`  | The heading of the card.                                 |
| `CardDescription` | `<p>`   | Supporting text.                                         |
| `CardAction`      | `<div>` | An action aligned to the end of the header.              |
| `CardContent`     | `<div>` | The main content.                                        |
| `CardFooter`      | `<div>` | Actions or notes at the bottom.                          |

Every part accepts `class` and passes other attributes to its element.

## Accessibility

`CardTitle` renders an `<h3>`. If that level does not fit your page outline, edit the element in `CardTitle.vibe`.
