# Contact Keeper Monorepo (Turborepo + pnpm)

This repository is a **pnpm workspace** managed by **Turborepo**. It’s structured to satisfy the group project requirements from the “Monorepo System Development” instructions:

- **`packages/ui-components`**: reusable UI components (currently wraps `packages/auth-ui`)
- **`packages/utils`**: shared utilities
- **`packages/feature-x`** + **`packages/feature-y`**: composable feature packages that use `ui-components` + `utils`
- **`apps/*`**: “system” apps that primarily **assemble/configure** features from `packages/*`

## Structure

- **`apps/auth`**: demo app that assembles `@repo/feature-x`
- **`apps/contact-keeper`**: demo app that assembles `@repo/feature-y`
- **`apps/api`**: existing Python API app (kept as-is)
- **`packages/auth-ui`**: existing React component library (Vite library build)
- **`packages/ui-components`**: required wrapper package that re-exports from `@contact-keeper/auth-ui`
- **`packages/utils`**: required shared utility package
- **`packages/feature-x`** / **`packages/feature-y`**: required feature packages

## Commands (run from repo root)

Install all workspace deps:

```bash
pnpm install
```

Run the runnable dev processes (apps + `auth-ui`):

```bash
pnpm dev
```

Run the Python API app (requires Python installed/configured on Windows):

```bash
pnpm dev:python-api
```

Build everything:

```bash
pnpm build
```

Clean build outputs:

```bash
pnpm clean
```
