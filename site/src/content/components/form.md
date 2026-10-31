---
title: Form
description: Connect VibeForm state to Field, labels, descriptions and validation messages.
---

<Example name="form-demo" />

## Installation

```bash
vibecn add form
```

<Installation name="form" />

The installer copies `FormField`, `FormErrorSummary` and `lib/form.ts`. It reuses the existing Field, Label and Separator primitives. It reports `@usevibejs/form@0.1.0` as an npm dependency and does not install that package for you.

## Usage

Create the form with `useForm` and one `useField` per control. `FormField` renders the label, description and error. Its slot receives the control id.

```vibe
<script setup lang="ts">
import { useField, useForm } from '@usevibejs/form';
import FormField from '@/components/ui/FormField.vibe';
import Input from '@/components/ui/Input.vibe';

const form = useForm({
  defaultValues: { email: '' },
  onSubmit: ({ value }) => value,
});
const email = useField(form, 'email', {
  validators: {
    onBlur: ({ value }) => (value.includes('@') ? undefined : 'Enter an email'),
  },
});
</script>

<template>
  <form @submit="form.submit">
    <FormField :field="email" label="Email" description="We will send the receipt here." required v-slot="{ id, invalid, describedBy }">
      <Input :id="id" v-model="email.value" :aria-invalid="invalid || undefined" :aria-describedby="describedBy" @blur="email.handleBlur" />
    </FormField>
  </form>
</template>
```

VibeForm remains headless. This registry item does not store field values.

## API Reference

| Export             | Inputs                                                                                                                               | Result                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `FormField`        | Required `field` with `name`, `invalid` and `messages`; required `label`; optional `description`, `required`, `disabled` and `class` | Label, description and error markup; default slot receives `id`, `invalid` and `describedBy`. |
| `FormErrorSummary` | Optional `messages` and `class`                                                                                                      | An alert when messages exist; exposes `focus()`.                                              |
| `useFormControl`   | A field and optional `{ required, described }` options                                                                               | Stable `ids`, computed `inputProps` and computed `errors`. Call during component setup.       |

## Accessibility

Pass the slot's `id`, `invalid` and `describedBy` values to the actual control so its label and validation messages remain associated. `required` and `disabled` on FormField describe the surrounding field; apply the corresponding native properties to the input as needed. FormErrorSummary exposes a focus method for submission failures and renders nothing when its message array is empty.
