# turborepo-starter

A React / Next.js / Turborepo monorepo scaffold with shared, machine-enforced
configuration.

## What's inside

```
turborepo-starter/
├─ apps/
│  └─ web/                   # Next.js 15 App Router app
├─ packages/
│  ├─ ui/                    # shared React component library (JIT compiled)
│  ├─ eslint-config/         # shared flat ESLint config (@repo/eslint-config)
│  └─ typescript-config/     # shared tsconfig bases (@repo/typescript-config)
├─ docs/
│  └─ best-practices.html    # full engineering handbook (open in a browser)
├─ turbo.json                # task pipeline + cache configuration
├─ pnpm-workspace.yaml
└─ CONTRIBUTING.md            # the enforced version of the handbook — read this
```

## Prerequisites

- **Node.js** >= 20
- **pnpm** >= 9 (`corepack enable` will pick up the pinned version)

## Getting started

```bash
pnpm install        # install all workspace dependencies
pnpm dev            # run every app in dev mode (turbo)
```

## Common commands

| Command             | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `pnpm dev`          | Run all apps in watch mode                              |
| `pnpm build`        | Build every package and app (cached by Turborepo)       |
| `pnpm lint`         | ESLint across the repo                                  |
| `pnpm check-types`  | TypeScript type-check across the repo                   |
| `pnpm test`         | Run all test suites                                     |
| `pnpm format`       | Format with Prettier                                    |

Scope any task to one package with `--filter`:

```bash
pnpm turbo run build --filter=web
pnpm turbo run lint  --filter=@repo/ui
```

## Documentation

- **[`docs/best-practices.html`](docs/best-practices.html)** — full handbook (open in a browser).
- **[`CONTRIBUTING.md`](CONTRIBUTING.md)** — the rules contributors must follow.

## License

MIT
