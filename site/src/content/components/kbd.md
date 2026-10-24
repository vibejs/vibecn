---
title: Kbd
description: Used to display textual user input from keyboard.
---

<Example name="kbd-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Kbd from '@/components/ui/Kbd.vibe';
</script>

<template>
  <Kbd>Ctrl</Kbd>
</template>
```

## API Reference

| Component  | Element | Notes                        |
| ---------- | ------- | ---------------------------- |
| `Kbd`      | `<kbd>` | A single key.                |
| `KbdGroup` | `<kbd>` | Groups keys into a shortcut. |
