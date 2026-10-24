# @usevibejs/vibecn

## 0.3.0

### Minor Changes

- 897c377: Add the chat components: Attachment, Bubble, Marker, Message and Message Scroller. The theme gains the `shimmer`, `scroll-fade-x` and `scroll-fade-b` utilities they use.
- 6bb9992: Add Direction. Components read the text direction from the nearest `dir` attribute: in right-to-left text the horizontal arrow keys swap in Tabs, Toggle Group, Menubar, Calendar, Carousel and Resizable, submenus open with ArrowLeft, and floating content mirrors its side and alignment. `lib/collection.ts` exports `isRtl` and `logicalKey`.

### Patch Changes

- 7129be2: Place Select, Combobox and other floating content correctly on its first opening. A
  popovertarget click opened the state before the browser showed the popover, so the first
  measure saw no size and an end-aligned list overflowed its trigger.
- 8a24654: Redesign the documentation homepage with a new vibecn logo, an interactive workspace,
  24 filterable live examples and four preview accent palettes. Optimize the transparent
  black-and-white brand assets as WebP and add a matching favicon. Prevent embedded
  command menus from scrolling the page when their first item is initialized.
- d24eff6: Rebuild the documentation homepage around shadcn/ui's neutral theme with a tabbed showcase
  of composed screens (cards, dashboard, chat and sign in). Add a components index page and a
  dedicated examples page, and point the header links to them.
- 2d788cf: Refine the vibecn logo with an achromatic polished-chrome finish, beveled edges and
  optimized transparent WebP artwork for navigation, the homepage and the favicon.
  Preserve the metallic reflections across light and dark themes.
- 2fa9b1b: Use shadcn/ui's exact theme list and values, with light and dark variants, in the homepage
  showcase theme preview.

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
