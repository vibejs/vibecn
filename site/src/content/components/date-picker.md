---
title: Date Picker
description: Compose a date picker with Popover and Calendar, including ranges and text input.
---

<Example name="date-picker-demo" />

## Installation

Date Picker is an application pattern, not a registry item. Install its parts:

```bash
pnpm dlx @usevibejs/vibecn@latest add popover calendar
```

<Installation name="calendar" />

<Installation name="popover" />

## Usage

Copy the example source. Bind Popover's `open` model, pass `:autofocus="open"` to Calendar,
and close the popover after a selection. Format the date-only string with a local time, as in the example.
The trigger label includes the selected date so it is announced when focus returns.

## Examples

### Range picker

Keep the popup open until Calendar emits a range with both `from` and `to`.

<Example name="date-picker-range" />

### Text input

Install `input` and `label` as well. This example accepts `YYYY-MM-DD`, validates it with
the calendar helper, and updates the visible month from typed dates. Invalid text stays
in the input for correction and does not become a selection.

<Example name="date-picker-input" />

## API Reference

| Part       | State                                                                 |
| ---------- | --------------------------------------------------------------------- |
| `Popover`  | `v-model:open` controls visibility                                    |
| `Calendar` | `v-model` for a date, `v-model:range` with `mode="range"` for a range |
| `Calendar` | `focus()` focuses the active day                                      |
| `Input`    | `v-model` holds the editable date string                              |

Validation, submission, formatting and when to dismiss belong to your application. This
pattern does not introduce a DatePicker component or a dependency on React date libraries.

## Accessibility

Give the popover an accessible name. Move focus to the active day after opening; the
calendar provides grid keyboard navigation. Escape, outside clicks and focus restoration
come from the native Popover API. Text input needs a label and an associated format hint;
invalid text is exposed with `aria-invalid`.
