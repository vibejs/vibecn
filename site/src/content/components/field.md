---
title: Field
description: Combine labels, controls and help text to compose accessible form fields and grouped inputs.
---

<Example name="field-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Field from '@/components/ui/Field.vibe';
import FieldDescription from '@/components/ui/FieldDescription.vibe';
import FieldError from '@/components/ui/FieldError.vibe';
import FieldGroup from '@/components/ui/FieldGroup.vibe';
import FieldLabel from '@/components/ui/FieldLabel.vibe';
import FieldLegend from '@/components/ui/FieldLegend.vibe';
import FieldSet from '@/components/ui/FieldSet.vibe';
import Input from '@/components/ui/Input.vibe';
</script>

<template>
  <FieldSet>
    <FieldLegend>Profile</FieldLegend>
    <FieldDescription>This appears on invoices and emails.</FieldDescription>
    <FieldGroup>
      <Field>
        <FieldLabel for="name">Full name</FieldLabel>
        <Input id="name" autocomplete="name" placeholder="Evil Rabbit" />
        <FieldDescription>This appears on invoices and emails.</FieldDescription>
      </Field>
    </FieldGroup>
  </FieldSet>
</template>
```

## Anatomy

- `FieldSet` is a `<fieldset>` that groups related fields, titled by a `FieldLegend`.
- `FieldGroup` stacks fields and sets a container for responsive layouts.
- `Field` wraps one control with its label, description and error. Set `orientation` to `horizontal` for checkboxes and switches, or `responsive` to switch at the container's width.
- `FieldContent` groups a label and description beside a control.
- `FieldLabel` is a `Label`; `FieldTitle` is a non-label title.
- `FieldSeparator` divides sections, with optional text in its slot.
- `FieldError` shows validation messages.

## Examples

### Choice card

Wrap a whole `Field` in a `FieldLabel` to make the card clickable. The card is highlighted when its control is checked.

<Example name="field-choice-card" />

### Validation

Set `data-invalid` on the `Field` and `aria-invalid` on the control. `FieldError` lists unique messages from `errors`, or shows its slot.

<Example name="field-error" />

## API Reference

| Component     | Prop          | Type                                         | Default      |
| ------------- | ------------- | -------------------------------------------- | ------------ |
| `Field`       | `orientation` | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` |
| `FieldSet`    | `disabled`    | `boolean`                                    |              |
| `FieldLegend` | `variant`     | `'legend' \| 'label'`                        | `'legend'`   |
| `FieldLabel`  | `for`         | `string`                                     |              |
| `FieldError`  | `errors`      | `({ message?: string } \| undefined)[]`      | `[]`         |

Every part accepts `class`.

## Accessibility

- `FieldSet` and `FieldLegend` give a group of controls a name, so screen readers announce it on entry.
- Link descriptions and errors to the control with `aria-describedby`.
- `FieldError` has the `alert` role and is announced when it appears.
