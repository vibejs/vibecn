---
title: Chart
description: Accessible native SVG bar, line, area and pie charts using theme colors.
---

<Example name="chart-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Chart from '@/components/ui/Chart.vibe';
const data = [
  { label: 'Jan', value: 186 },
  { label: 'Feb', value: 305 },
  { label: 'Mar', value: 237 },
];
</script>

<template>
  <Chart type="bar" label="Monthly visitors" :data="data" />
</template>
```

Chart uses SVG directly, keeping the source distribution free of an additional chart runtime.
It supports one labeled
numeric series. Bar and pie entries cycle through `--chart-1` to `--chart-5`; line and area
use `--chart-1`. Override those variables in your theme, or supply a color on bar and pie entries.

## Examples

### Chart types

<Example name="chart-types" />

Bar, line and area include zero in their scale and support negative values. Pie uses only
positive values for slice sizes. Non-finite numbers become zero. Empty datasets and pie
datasets without positive values show “No data”.

## API Reference

| Prop          | Type                                                 | Default   |
| ------------- | ---------------------------------------------------- | --------- |
| `type`        | `'bar' \| 'line' \| 'area' \| 'pie'`                 | `'bar'`   |
| `data`        | `{ label: string; value: number; color?: string }[]` | `[]`      |
| `label`       | `string`                                             | `'Chart'` |
| `description` | `string`                                             |           |
| `valueLabel`  | `string`                                             | `'Value'` |
| `class`       | `ClassValue`                                         |           |

Unlike upstream's Recharts wrapper, this API renders the chart itself. Recharts components,
ChartContainer, ChartConfig, custom axes, tooltips, animation and multi-series composition
are not supported. Dense datasets and long labels may need application-specific layout;
the chart does not automatically abbreviate or rotate labels.

The figure forwards native attributes and listeners. SVG scales to its container through
a viewBox. The library does not inject generated style strings or load external scripts.

## Accessibility

The figure has a visible caption. SVG exposes an image role associated with that caption
and the optional description. A visually hidden table gives every label and numeric value
to assistive technology, so color and pointer hover are not required to read the data.
Native SVG titles supply simple pointer hints. Charts are static and add no tab stops.
