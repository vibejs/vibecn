---
title: Login Form
description: Email and password fields from @usevibejs/form, with a submit callback for your auth client.
---

<Example name="login-form-demo" />

## Installation

<Installation />

Install `@usevibejs/form` for the fields and `@usevibejs/auth` in the application that handles sign-in. `@usevibejs/auth` depends on `better-auth`. This component imports `@usevibejs/form` only. It does not import Better Auth or `@usevibejs/auth`.

## Usage

```vibe
<script setup lang="ts">
import { useAuth } from '@usevibejs/auth';
import LoginForm from '@/components/ui/LoginForm.vibe';

const auth = useAuth();
async function signIn(value: { email: string; password: string }): Promise<void> {
  const result = await auth.client.signIn.email(value);
  if (result.error) throw new Error('Those credentials were not accepted.');
}
</script>

<template>
  <LoginForm :submit="signIn" />
</template>
```

`submit` receives `{ email, password }` after the field checks pass. Throw to show a form-level alert. The message is the error's `message`, or "Sign in failed." Field checks require an email address containing `@` and a non-empty password. They are not a password policy; the auth client owns that.

While `submit` is in progress the button reads the pending label, the fields disable, and the form is `aria-busy`.

## API Reference

| Prop            | Type                                                                    | Default       |
| --------------- | ----------------------------------------------------------------------- | ------------- |
| `submit`        | `(value: { email: string; password: string }) => Promise<void> \| void` |               |
| `emailLabel`    | `string`                                                                | `Email`       |
| `passwordLabel` | `string`                                                                | `Password`    |
| `submitLabel`   | `string`                                                                | `Sign in`     |
| `pendingLabel`  | `string`                                                                | `Signing in…` |
| `class`         | `ClassValue`                                                            |               |

## Accessibility

Each control has a label, `autocomplete`, and `aria-invalid` when its field error is showing. The error is an alert linked with `aria-describedby`. A rejected submit is a separate alert. The submit button is `type="submit"` and disables while the request is pending.
