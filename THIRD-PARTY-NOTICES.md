# Third-party notices

vibecn is an independent port of shadcn/ui for vibe.js. It is not affiliated with or endorsed by shadcn/ui.

## shadcn/ui

Source: https://github.com/shadcn-ui/ui
Revision: ffd225775bbb7955a673f08bb9be4a63600d9dfb
Adapted files include apps/v4/registry/new-york-v4/ui/{button,badge,card,input,textarea,skeleton,label,separator,calendar,carousel,chart,sidebar}.tsx and theme tokens. Other adapted component sources carry the same notice in their .vibe files.

The React rendering layer was replaced with vibe.js templates, models and attribute forwarding. Button and Badge do not implement asChild. CardTitle uses h3. Label and Separator use native elements. Skeleton respects reduced motion. The neutral theme retains the shadcn token vocabulary.

Calendar implements its own Gregorian date grid instead of react-day-picker. Carousel uses native scroll snapping instead of Embla. Chart uses native SVG instead of Recharts. Sidebar uses native elements, localStorage and the existing Sheet; it does not use Radix Slot. These dependencies' source code is not bundled.

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Dependency licenses

The installed utility imports clsx (MIT) and tailwind-merge (MIT); their packages carry their own license texts. No React, Radix or Base UI source is bundled.
