# vibecn

An independent shadcn/ui port for vibe.js. Read CONTRACTS.md and docs/decisions/ before changing distribution or component APIs.

- English only in code, documentation, messages and commits.
- Keep upstream copyright and license notices in source files and distributions.
- Never publish packages or create remote resources without an explicit release request.
- Releases go through changesets and .github/workflows/release.yml. Add a changeset for every user-visible change.
- Use catalog: or workspace:* dependencies. Keep relative TypeScript imports ending in .ts.
- Do not depend on @usevibejs/ui/internal directly. Components ship as .vibe source.
- Unit tests live beside src code. Component and package integration fixtures live in test/.
- pnpm check and pnpm test:integration must pass; pnpm build must leave no tracked diff.
- Runtime TypeScript has 100% coverage per file. Do not add coverage ignores.
- Preserve user files by default. Validate every destination before writing. Never follow destination symlinks.
- Do not add AI attribution, Co-Authored-By or Signed-off-by commit trailers.
