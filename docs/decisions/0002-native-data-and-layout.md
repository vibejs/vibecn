# 0002. Native data and layout components

Status: Accepted

Calendar uses a Gregorian month grid with locale labels and week starts from Intl. Its models
are local ISO date strings (`YYYY-MM-DD`), arrays of those strings, or a `{ from, to }` range.
This avoids converting a date-only selection through UTC. Disabled days remain focusable in
the grid, but cannot be selected; a range cannot cross a disabled day.

Carousel uses browser scroll snapping and scrollIntoView. It has no autoplay, infinite loop,
Embla API or plugins. Pointer scrolling and keyboard navigation update the same slide index.

Chart uses native SVG rather than a framework adapter. Recharts is React-specific; adding a
second chart runtime would impose an unnecessary dependency on this source distribution.
The initial API accepts a labeled numeric series and a bar, line, area or pie type. Every
chart includes a table for assistive technology and theme colors from --chart-1 through 5.
This deliberately does not reproduce Recharts' compositional, tooltip or multi-series APIs.

Sidebar keeps separate desktop and mobile state, stores desktop state in localStorage when
a storage key is supplied, and uses the existing Sheet on mobile. Menu buttons render native
buttons, with a separate link part for navigation; asChild is not supported.

Date Picker and Data Table are documented compositions, not registry components. Their
application-specific state and validation stay in the examples.
