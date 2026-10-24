---
title: CLI
description: Use the vibecn CLI to add components to your application.
order: 3
---

The CLI ships in the `@usevibejs/vibecn` package. Run it with your package manager's runner, or install it as a development dependency.

```bash
pnpm dlx @usevibejs/vibecn@latest <command>
```

## init

Creates `vibecn.json`, the theme stylesheet and `vibecn.LICENSE`.

```bash
vibecn init
```

`init` requires `@usevibejs/ui` in your `package.json`. Existing files are never replaced unless you pass `--overwrite`.

## add

Copies components, the shared class utility and the license notices into your project.

```bash
vibecn add button card
vibecn add --all
```

Dependencies between components are resolved automatically. A file that already exists with identical content is skipped. A file with different content stops the installation so your changes are never lost; review it, then pass `--overwrite` to replace it.

## list

Shows the available components.

```bash
vibecn list
```

## Options

| Option              | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `--cwd <directory>` | The application root. Defaults to the current directory.           |
| `--dry-run`         | Checks for conflicts and prints the plan without writing anything. |
| `--overwrite`       | Replaces files whose content differs.                              |
| `--json`            | Prints one JSON result, for scripts and tools.                     |
| `--help`            | Shows the usage.                                                   |
| `--version`         | Shows the version.                                                 |

## Safety

- Every destination is checked before anything is written. Paths outside the application and symbolic links are rejected.
- The whole plan is validated first, then checked again right before writing.
- The CLI never edits `package.json`, never runs a package manager and never changes existing stylesheets. It prints the dependencies you need instead.
- Components come from the registry bundled in the package. The CLI never downloads code.

## vibecn.json

```json
{
  "version": 1,
  "paths": {
    "components": "src/components/ui",
    "lib": "src/lib",
    "styles": "src/vibecn.css"
  }
}
```

Edit the paths to place files elsewhere. They must stay inside your application. If you move the stylesheet, move the generated file too.
