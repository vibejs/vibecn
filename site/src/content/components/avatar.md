---
title: Avatar
description: An image element with a fallback for representing the user.
---

<Example name="avatar-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Avatar from '@/components/ui/Avatar.vibe';
import AvatarFallback from '@/components/ui/AvatarFallback.vibe';
import AvatarImage from '@/components/ui/AvatarImage.vibe';
</script>

<template>
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
</template>
```

The fallback is shown until the image has loaded, and stays when the image fails to load or `src` is empty.

## Examples

### Sizes and badges

<Example name="avatar-sizes" />

## API Reference

| Component          | Prop   | Type                        | Default     |
| ------------------ | ------ | --------------------------- | ----------- |
| `Avatar`           | `size` | `'default' \| 'sm' \| 'lg'` | `'default'` |
| `AvatarImage`      | `src`  | `string`                    |             |
|                    | `alt`  | `string`                    | `''`        |
| `AvatarFallback`   |        |                             |             |
| `AvatarBadge`      |        |                             |             |
| `AvatarGroup`      |        |                             |             |
| `AvatarGroupCount` |        |                             |             |

`AvatarImage` and `AvatarFallback` must be inside an `Avatar`. Every part accepts `class`.

## Accessibility

Give `AvatarImage` an `alt` that names the person. When the avatar repeats a name shown next to it, keep `alt` empty so it is not read twice.
