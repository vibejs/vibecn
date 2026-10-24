---
title: Breadcrumb
description: Displays the path to the current resource using a hierarchy of links.
---

<Example name="breadcrumb-demo" />

## Installation

<Installation />

## Usage

```vibe
<script setup lang="ts">
import Breadcrumb from '@/components/ui/Breadcrumb.vibe';
import BreadcrumbItem from '@/components/ui/BreadcrumbItem.vibe';
import BreadcrumbLink from '@/components/ui/BreadcrumbLink.vibe';
import BreadcrumbList from '@/components/ui/BreadcrumbList.vibe';
import BreadcrumbPage from '@/components/ui/BreadcrumbPage.vibe';
import BreadcrumbSeparator from '@/components/ui/BreadcrumbSeparator.vibe';
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
```

## Examples

### Custom separator

Pass any content to `BreadcrumbSeparator` to replace the chevron.

<Example name="breadcrumb-separator" />

### With the router

`BreadcrumbLink` renders an `<a>`. For client-side navigation, use a `RouterLink` with the same classes inside `BreadcrumbItem`:

```vibe
<BreadcrumbItem>
  <RouterLink to="/docs" class="transition-colors hover:text-foreground">Docs</RouterLink>
</BreadcrumbItem>
```

## API Reference

| Component             | Element  | Notes                                                            |
| --------------------- | -------- | ---------------------------------------------------------------- |
| `Breadcrumb`          | `<nav>`  | Labelled `breadcrumb`.                                           |
| `BreadcrumbList`      | `<ol>`   |                                                                  |
| `BreadcrumbItem`      | `<li>`   |                                                                  |
| `BreadcrumbLink`      | `<a>`    | `href`, `target`, `rel`.                                         |
| `BreadcrumbPage`      | `<span>` | The current page, with `aria-current="page"`.                    |
| `BreadcrumbSeparator` | `<li>`   | Hidden from assistive technology. Its slot replaces the chevron. |
| `BreadcrumbEllipsis`  | `<span>` | Collapsed items.                                                 |
