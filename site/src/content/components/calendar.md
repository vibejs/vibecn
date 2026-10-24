---
title: Calendar
description: A locale-aware date grid with single, multiple and range selection.
---

<Example name="calendar-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Calendar from '@/components/ui/Calendar.vibe';
const date = ref<string | null>(null);
</script>

<template>
  <Calendar v-model="date" class="rounded-md border" />
</template>
```

Selections are local Gregorian dates in `YYYY-MM-DD` format. Months use `YYYY-MM`.
Use these strings directly in date-only APIs; converting them through UTC can change the
displayed date. Pass valid dates to the models and bounds, with `min <= max`.

## Examples

### Multiple dates

Use `mode="multiple"` with `v-model:values`. Clicking a selected day removes it.

<Example name="calendar-multiple" />

### Date range

Use `mode="range"` with `v-model:range`. The first click sets `from`, and the second sets an
inclusive, ordered range. A third starts a new range. A range that crosses a disabled day
starts again at the clicked day.

<Example name="calendar-range" />

### Locale and disabled dates

Labels use `Intl.DateTimeFormat` and `Intl.NumberFormat`. Week start uses `Intl.Locale`
week information, with a territory fallback for older browsers. Override it with
`weekStartsOn` when needed. `min` and `max` are inclusive.

<Example name="calendar-locale" />

Use `defaultMonth` for an initial view, or bind `v-model:month` to control navigation.

## API Reference

| Prop              | Type                                                 | Default                         |
| ----------------- | ---------------------------------------------------- | ------------------------------- |
| `v-model`         | `string \| null`                                     | `null`                          |
| `v-model:values`  | `string[]`                                           | `[]`                            |
| `v-model:range`   | `{ from?: string; to?: string }`                     | `{}`                            |
| `v-model:month`   | `string`                                             | Selected month or current month |
| `defaultMonth`    | `string`                                             | Selected month or current month |
| `autofocus`       | `boolean`                                            | `false`                         |
| `mode`            | `'single' \| 'multiple' \| 'range'`                  | `'single'`                      |
| `locale`          | `string`                                             | `'en-US'`                       |
| `weekStartsOn`    | `0 .. 6` (Sunday .. Saturday)                        | Locale week start               |
| `min`, `max`      | `string`                                             |                                 |
| `disabled`        | `boolean \| string[] \| ((date: string) => boolean)` |                                 |
| `showOutsideDays` | `boolean`                                            | `true`                          |
| `label`           | `string`                                             | `'Choose a date'`               |
| `class`           | `ClassValue`                                         |                                 |

The exposed `focus()` method focuses the active day. Set `autofocus` to true when opening a popup;
Calendar waits for the native popup focus step before moving focus. Each model emits its corresponding
`update:*` event. Use the model that matches the mode.

This is an independent implementation, without react-day-picker. Its formatters, matchers,
caption dropdowns, week numbers, multiple months and custom component APIs are not supported.
Locale changes the labels and week start; it does not change the Gregorian calendar.

## Accessibility

The month is a live heading and a labeled grid. Full weekday names accompany abbreviated
headers. One day is in the Tab sequence. Arrow keys move by day or week; Home and End move
to the edges of the locale week. PageUp and PageDown change month, and Shift changes year,
clamping the day at shorter months. Enter and Space select the focused day.

Disabled days remain focusable and announce `aria-disabled`; activation leaves selection
unchanged. Bounds stop keyboard navigation and month buttons. Selected cells use
`aria-selected`, and today uses `aria-current="date"`.

For a popup that restores focus on dismissal, see [Date Picker](/docs/components/date-picker).
