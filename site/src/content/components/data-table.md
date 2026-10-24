---
title: Data Table
description: Compose a data table with sorting, filtering, pagination, selection and column visibility.
---

<Example name="data-table-demo" />

## Installation

Data Table is an application pattern built on Table, not a registry item. Install its parts:

```bash
pnpm dlx @usevibejs/vibecn@latest add table checkbox dropdown-menu input button
```

<Installation name="table" />

## Usage

Copy the example source and replace the sample rows with your data. All table state and
transformations stay in the example: filter first, sort a new array, then slice the current
page. The page size is three to make the behavior easy to try.

## Examples

The example includes email sorting and filtering, previous/next pagination, row selection
with Checkbox, and column visibility with DropdownMenuCheckboxItem. The header checkbox
selects only the current page and shows an indeterminate state for a partial selection.
Selected row IDs persist across pages and filters. The status reports selected rows within
the current filtered result. Sorting or changing the filter returns to the first page.

For server data, move these operations to your request layer and keep selection keyed by
stable IDs. This implementation intentionally does not depend on TanStack Table, whose
upstream React adapter is not applicable to vibe.js.

## API Reference

| State                      | Purpose                          |
| -------------------------- | -------------------------------- |
| `filter`                   | Case-insensitive email substring |
| `ascending`                | Email sort order                 |
| `page`, `pageSize`         | Zero-based page and page size    |
| `selected`                 | Stable IDs of selected rows      |
| `showStatus`, `showAmount` | Optional column visibility       |

See [Table](/docs/components/table), [Checkbox](/docs/components/checkbox) and
[Dropdown Menu](/docs/components/dropdown-menu) for the component APIs. There is no
DataTable registry component, generic row engine or virtualization layer.

## Accessibility

The native table retains its caption, column headers and `aria-sort` state. Every checkbox
names its row or its page-wide action. The filter has an accessible name; selection counts
are announced through a live region. Empty results use a spanning cell. Pagination controls
disable at boundaries, and column visibility uses keyboard-operable menu checkboxes.
