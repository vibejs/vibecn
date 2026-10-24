import pages from 'virtual:docs-index';

export interface NavItem {
  title: string;
  href: string;
}

const order = (path: string, value: string | undefined): number =>
  path === 'docs/introduction' ? 0 : Number(value ?? 99);

const guides: NavItem[] = pages
  .filter((page) => page.path.startsWith('docs/'))
  .sort((a, b) => order(a.path, a.frontmatter.order) - order(b.path, b.frontmatter.order))
  .map((page) => ({
    title: page.frontmatter.title,
    href: page.path === 'docs/introduction' ? '/docs' : `/${page.path}`,
  }));

const components: NavItem[] = pages
  .filter((page) => page.path.startsWith('components/'))
  .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
  .map((page) => ({ title: page.frontmatter.title, href: `/docs/${page.path}` }));

export const sections = [
  { title: 'Getting Started', items: guides },
  { title: 'Components', items: components },
];

export const pagesInOrder: NavItem[] = [...guides, ...components];
export const componentCount = components.length;
