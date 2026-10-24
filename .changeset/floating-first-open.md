---
'@usevibejs/vibecn': patch
---

Place Select, Combobox and other floating content correctly on its first opening. A
popovertarget click opened the state before the browser showed the popover, so the first
measure saw no size and an end-aligned list overflowed its trigger.
