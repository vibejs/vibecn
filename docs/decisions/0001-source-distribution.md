# 0001. Distribute component source

Status: Accepted

vibe.js v0.1 does not promise packaged .vibe components or a stable internal render ABI. vibecn therefore distributes source through a small offline CLI and a static registry. The application compiles those files with its own compiler. A separate repo lets component releases evolve independently from the framework.

CLI and registry metadata are bundled together. Installation does not fetch or execute third-party registry code. A future compiled library requires an explicit supported packaging contract in vibe.js.

The first release covers native elements and layout components. React Radix/Base UI primitives are not dependencies. Composite widgets will be added only with keyboard, focus, pointer and screen reader verification.
