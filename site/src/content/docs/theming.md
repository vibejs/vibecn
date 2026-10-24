---
title: Theming
description: Customize colors, radius and dark mode with CSS variables.
order: 2
---

vibecn styles every component with Tailwind utilities that read semantic CSS variables, such as `bg-primary` or `text-muted-foreground`. Change a variable in `vibecn.css` and every component follows.

## Convention

Colors come in pairs: a background variable and a `-foreground` variable for the text on top of it.

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

```vibe
<div class="bg-primary text-primary-foreground">Hello</div>
```

## Variables

| Variable                                 | Used for                                                             |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `--background` / `--foreground`          | The page and its default text.                                       |
| `--card` / `--card-foreground`           | Cards and other raised surfaces.                                     |
| `--popover` / `--popover-foreground`     | Popovers, menus and other floating surfaces.                         |
| `--primary` / `--primary-foreground`     | Primary actions, such as the default button.                         |
| `--secondary` / `--secondary-foreground` | Secondary actions.                                                   |
| `--muted` / `--muted-foreground`         | Subtle backgrounds and secondary text.                               |
| `--accent` / `--accent-foreground`       | Hover and selected states.                                           |
| `--destructive`                          | Destructive actions and errors.                                      |
| `--border`                               | Borders and separators.                                              |
| `--input`                                | Form control borders.                                                |
| `--ring`                                 | Focus rings.                                                         |
| `--radius`                               | The base corner radius; `rounded-sm` to `rounded-xl` derive from it. |

## Adding a color

Declare the variable for both themes, then expose it to Tailwind with `@theme inline`:

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

`bg-warning` and `text-warning-foreground` are now available everywhere.

## Dark mode

The dark theme applies inside any element with the `dark` class. Toggle it on the `<html>` element:

```ts
document.documentElement.classList.toggle('dark', isDark);
```

To follow the system setting without a flash of the wrong theme, add a small script to `index.html` before your app loads:

```html
<script>
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches))
      document.documentElement.classList.add('dark');
  } catch {}
</script>
```

## Overriding a single component

Every component accepts `class`. Your classes are merged last with tailwind-merge, so conflicting utilities replace the defaults instead of fighting them:

```vibe
<Button class="rounded-full px-6">Rounded</Button>
```

For a permanent change, edit the component file. That is what it is there for.
