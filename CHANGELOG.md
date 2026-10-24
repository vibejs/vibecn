# @usevibejs/vibecn

## 0.2.0

### Minor Changes

- d9d9052: Add Input OTP, Resizable, Scroll Area, Sonner, Tabs and Toggle Group, with a shared `lib/collection.ts` helper for keyboard navigation and a `toast()` store in `lib/toast.ts`. Toggle exposes its variant and size as data attributes.
- 37b1266: Add Calendar, Carousel, native SVG Chart and responsive Sidebar components, chart and sidebar
  theme tokens, and Date Picker and Data Table documentation patterns.
- 8f76a7c: Align the components with the current shadcn/ui styles. Button gains the `xs`, `icon-xs`, `icon-sm` and `icon-lg` sizes and a `form` prop, Badge gains the `ghost` and `link` variants, and CardHeader places CardAction in the top-right corner without extra classes. The theme adds popover tokens and sets the default border and outline colors.
- e439cd2: Add 20 components: Alert, Aspect Ratio, Avatar, Breadcrumb, Button Group, Checkbox, Empty, Field, Input Group, Item, Kbd, Native Select, Pagination, Progress, Radio Group, Slider, Spinner, Switch, Table and Toggle. Form controls build on native inputs, so keyboard behavior and form submission come from the browser.
- eb71894: Add Combobox, Command, Context Menu, Dropdown Menu, Menubar, Navigation Menu and Select. Menus share `lib/menu.ts` for focus, keyboard and submenu behavior; command menus and comboboxes keep focus in their input and track the active option with `aria-activedescendant`. Floating content can be anchored to a point.
- f799675: Add Accordion, Alert Dialog, Collapsible, Dialog, Drawer, Hover Card, Popover, Sheet and Tooltip. They build on native modal dialogs, the popover attribute and details elements, with a shared `lib/overlay.ts` helper for state and positioning. Button gains `popovertarget` and `popovertargetaction`, components let attributes override their `data-slot`, and the theme stops the page from scrolling behind a modal dialog.

## 0.1.0

### Minor Changes

- Initial release.
