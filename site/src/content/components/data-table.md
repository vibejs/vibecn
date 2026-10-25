---
title: Data Table
description: Powerful VibeTable tables with native reactivity, typed cells and editable Vibecn components.
---

<Example name="data-table-demo" />

## Installation

Install the complete composition and its primitive dependencies:

```bash
vibecn add data-table
```

<Installation name="data-table" />

The installer copies editable `.vibe` source, the type utility and existing Table, Checkbox,
Button, Input, DropdownMenu and Skeleton dependencies. It reports `@usevibejs/table@0.1.0` as
an additional dependency. It preserves destination/conflict checks and never edits package.json
or runs a package manager. Before the adapter's first publication, build and pack the local
VibeTable repository and install its tarball in the application.

## Usage

Create one `useTable` instance in component setup and pass it to `DataTable`,
`DataTableToolbar` and `DataTablePagination`. Register only the TanStack Table **v9** features
and row-model factories you need. Data and columns support refs, computed values and getters;
replace arrays when editing data so Core can invalidate its caches. `getRowId` should return a
stable domain ID when selection must survive page changes and replacement.

The example uses Core 9.3.1 through VibeTable. Core owns sorting, filtering, faceting,
pagination, selection, column visibility and sizing. Components read the native reactive graph;
they do not force render or rebuild the table when state changes.

## Custom cells

A `.vibe` cell component declares a `context` prop with
`CellContext<typeof features, Payment, TValue>`. Set its column's cell to
`componentRenderer(MyCell)`. The same helper supports typed custom headers. The installed
DataTableContent evaluates text or component descriptors and renders `<component :is>`
declaratively. Normal text is escaped. JSX, virtual DOM objects and raw HTML render strings
are not supported.

Vibe currently has no generic SFC syntax. Reusable DataTable slots therefore receive structural
row/cell/header types, with row originals typed `unknown`. Application cell components retain
the full row, feature and accessor-value types through registration.

## API Reference

### Building blocks

| Component                 | Purpose                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| DataTable                 | Semantic table, grouped headers, density and loading/error/empty states |
| DataTableColumnHeader     | Sort ascending/descending, clear sorting and hide a column              |
| DataTableToolbar          | Search, reset and filter/action slots                                   |
| DataTablePagination       | Page size, counts and first/previous/next/last navigation               |
| DataTableViewOptions      | Column visibility menu                                                  |
| DataTableRowActions       | Application-owned row commands                                          |
| DataTableFacetedFilter    | Multi-select membership filters and facet counts                        |
| DataTableSelectionActions | Selected count, bulk action slot and clear selection                    |
| DataTableEmptyState       | Empty table row and customizable guidance                               |
| DataTableLoadingState     | Skeleton rows and announced loading text                                |
| DataTableContent          | Declarative text and component outlet                                   |

## Example interactions

The payments dashboard includes search, faceted status filtering, sorting, page-size selection,
column menus, resizing by pointer or Left/Right keys, compact/comfortable density, and native
selection checkboxes with a partial page state. Bulk marking, refunding, removing payments and
CSV export operate on the local application data. No decorative buttons are included.

| DataTable prop | Type                   | Purpose                               |
| -------------- | ---------------------- | ------------------------------------- |
| table          | DataTableInstance      | The application-owned native table    |
| caption        | string                 | Required accessible table description |
| loading        | boolean                | Busy state and skeleton rows          |
| error          | string or null         | Error message with alert semantics    |
| density        | compact or comfortable | Cell spacing                          |
| class          | ClassValue             | Merged root classes                   |

Table accepts `caption`, `table`, `loading`, `error` and `density` (`compact` or `comfortable`).
Named `header`, `cell`, `empty` and `error` slots customize rendering. Error content has alert
semantics; place retry controls in its slot. Loading shows a busy table with decorative
skeletons and one announced message. Existing Table primitives remain independently usable.

## Server data

Use `manualPagination`, `manualSorting` and `manualFiltering`, supply the server page and
`rowCount`/`pageCount`, and derive the request from table atoms. Loading, error and retry state
stay in the application. External writable atoms or controlled values plus their change
callbacks can own state. For server bulk operations use stable selected IDs; row models contain
only the currently loaded data. VibeQuery integration is optional and has no dependency from
VibeTable to the query package.

## Accessibility and boundaries

Components retain native table markup, captions, column scope, sorting announcements,
checkbox labels and keyboard/focus behavior from existing menu primitives. Colors use the
current light/dark tokens; status also has text. Horizontal overflow preserves table semantics
on mobile. Pinning, grouping, cell spans and spreadsheet-style selection are available from
Core, while their specialized visual interactions belong to application renderers. The generic
DataTable is an ordinary semantic table; the separate VibeTable example application contains
optional TanStack Virtual Core integration for large read-focused datasets.
