export interface Frontmatter {
  title: string;
  description: string;
  [key: string]: string;
}

export type Block =
  | { type: 'html'; html: string }
  | { type: 'example'; name: string; html: string; code: string; align?: string }
  | {
      type: 'installation';
      name: string;
      command: string;
      dependencies: string[];
      files: { path: string; html: string; code: string }[];
    };

export interface DocPage {
  frontmatter: Frontmatter;
  toc: { depth: number; text: string; id: string }[];
  blocks: Block[];
}
