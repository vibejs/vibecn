declare module '*.md' {
  import type { DocPage } from './site/types.ts';
  const page: DocPage;
  export default page;
}

declare module 'virtual:docs-index' {
  import type { Frontmatter } from './site/types.ts';
  const pages: { path: string; frontmatter: Frontmatter }[];
  export default pages;
}
