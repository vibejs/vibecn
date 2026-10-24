---
title: Tabs
description: A set of layered sections of content, known as tab panels, that are displayed one at a time.
---

<Example name="tabs-demo" align="start" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import { ref } from '@usevibejs/ui';
import Tabs from '@/components/ui/Tabs.vibe';
import TabsContent from '@/components/ui/TabsContent.vibe';
import TabsList from '@/components/ui/TabsList.vibe';
import TabsTrigger from '@/components/ui/TabsTrigger.vibe';

const tab = ref('account');
</script>

<template>
  <Tabs v-model="tab">
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">Make changes to your account here.</TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
  </Tabs>
</template>
```

## Examples

### Line

<Example name="tabs-line" />

### Vertical

<Example name="tabs-vertical" />

## API Reference

| Component     | Prop             | Type                         | Default        |
| ------------- | ---------------- | ---------------------------- | -------------- |
| `Tabs`        | `v-model`        | `string`                     | `''`           |
|               | `orientation`    | `'horizontal' \| 'vertical'` | `'horizontal'` |
|               | `activationMode` | `'automatic' \| 'manual'`    | `'automatic'`  |
| `TabsList`    | `variant`        | `'default' \| 'line'`        | `'default'`    |
| `TabsTrigger` | `value`          | `string`                     |                |
|               | `disabled`       | `boolean`                    | `false`        |
| `TabsContent` | `value`          | `string`                     |                |

## Accessibility

Tabs follow the WAI-ARIA tabs pattern. <kbd>Tab</kbd> moves into the list onto the selected tab and out of it to the panel. The arrow keys move between tabs along the orientation, <kbd>Home</kbd> and <kbd>End</kbd> go to the first and last, and focus selects the tab unless `activationMode` is `manual`, in which case <kbd>Enter</kbd> or <kbd>Space</kbd> does.
