---
title: Input OTP
description: Accessible one-time password component with copy paste functionality.
---

<Example name="input-otp-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import InputOTP from '@/components/ui/InputOTP.vibe';
import InputOTPGroup from '@/components/ui/InputOTPGroup.vibe';
import InputOTPSeparator from '@/components/ui/InputOTPSeparator.vibe';
import InputOTPSlot from '@/components/ui/InputOTPSlot.vibe';

const code = ref('');
</script>

<template>
  <InputOTP v-model="code" :maxlength="6" aria-label="One-time password">
    <InputOTPGroup>
      <InputOTPSlot :index="0" />
      <InputOTPSlot :index="1" />
      <InputOTPSlot :index="2" />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot :index="3" />
      <InputOTPSlot :index="4" />
      <InputOTPSlot :index="5" />
    </InputOTPGroup>
  </InputOTP>
</template>
```

One real input sits over the slots and receives all typing, pasting and one-time code autofill from the browser or password manager. The slots only display its value.

## Examples

### Pattern

Pass a `pattern` for one allowed character. Other characters are dropped as they are typed or pasted.

<Example name="input-otp-pattern" />

## API Reference

| Prop        | Type                      | Default |
| ----------- | ------------------------- | ------- |
| `v-model`   | `string`                  | `''`    |
| `maxlength` | `number`                  | `6`     |
| `pattern`   | `string`                  | `'\d'`  |
| `name`      | `string`                  |         |
| `disabled`  | `boolean`                 | `false` |
| `required`  | `boolean`                 | `false` |
| `@complete` | `(value: string) => void` |         |

Attributes such as `aria-label` and `inputmode` go to the input. `InputOTPSlot` takes the `index` of the character it shows.

## Accessibility

Screen readers see a single text input with `autocomplete="one-time-code"`; the slots are hidden from them. Give the input a name with `aria-label` or a label.
