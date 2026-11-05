---
title: Language Switcher
description: Chooses a locale with the combobox. The active locale comes from @usevibejs/i18n.
---

<Example name="language-switcher-demo" />

## Installation

<Installation />

This block depends on the `combobox` registry item, so `vibecn add language-switcher` copies those files too. Install `@usevibejs/i18n` and provide it on the app (`app.use(i18n)` or `createLocaleContext` in a parent). The switcher calls `useI18n()`. It does not replace the combobox, and the installer still writes `vibecn.LICENSE`.

## Usage

```vibe
<script setup lang="ts">
import { useI18n } from '@usevibejs/i18n';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher.vibe';

const { locale } = useI18n();
const locales = [
  { value: 'en', label: 'English' },
  { value: 'tr', label: 'Türkçe' },
];
</script>

<template>
  <LanguageSwitcher
    :locales="locales"
    label="Language"
    empty-label="No language"
    loading-label="Switching language"
    retry-label="Try again"
  />
  <p>{{ locale }}</p>
</template>
```

Pass native-language labels and translated `label`, `emptyLabel`, `loadingLabel` and `retryLabel` strings. The default action is `setLocale` from the injected i18n instance. Routed apps pass `change(locale)` and reject when navigation is aborted. Locale persistence stays on the i18n instance.

A failed change keeps the previous locale and shows the retry button. A newer request wins over an older one. Leaving the component cancels updates from a request that is still running.

## API Reference

| Prop           | Type                                          | Default |
| -------------- | --------------------------------------------- | ------- |
| `locales`      | `readonly { value: string; label: string }[]` |         |
| `label`        | `string`                                      |         |
| `emptyLabel`   | `string`                                      |         |
| `loadingLabel` | `string`                                      |         |
| `retryLabel`   | `string`                                      |         |
| `change`       | `(locale: string) => Promise<unknown>`        |         |
| `class`        | `ClassValue`                                  |         |

## Accessibility

The combobox input is named by `label`. Options use the locale as their language. The active locale is marked in the list. Loading is a status and the root is `aria-busy` while a change is in flight. A failed change is an alert whose button retries that locale. The root follows the active `dir`.
