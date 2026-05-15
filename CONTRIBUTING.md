# Contributing

This document is the **enforced** version of the engineering handbook in
[`docs/best-practices.html`](docs/best-practices.html). The handbook explains the
*why*; this file states the *rules*. The ESLint and TypeScript configs are the
machine-enforced subset — if a rule here can be linted, it should be.

Keep this file and the handbook in sync when conventions change.

---

## 1. Repository structure

```
apps/       deployable things — thin composition only
packages/   everything reusable
```

### Hard rules (enforced in review, ideally in lint)

1. **Apps never import from other apps.** Apps import from `packages/*` only.
2. **Packages never import from apps.** Dependencies point `packages → packages`
   and `apps → packages`, never the reverse.
3. **No cross-feature reach-ins.** A feature folder imports from its own files,
   from `packages/*`, or from shared app-level folders — not from a sibling
   feature's internals.
4. **Shared config lives in a package**, never copy-pasted. Extend
   `@repo/eslint-config` and `@repo/typescript-config`.
5. **Dependencies are declared where they are used.** Each `package.json` lists
   its own dependencies. Do not rely on hoisting.
6. **One version of React / Next / TypeScript** across the repo. Bump them
   together.

### Adding a new package

```
packages/<name>/
├─ package.json        name: "@repo/<name>", "private": true
├─ tsconfig.json       extends a @repo/typescript-config base
├─ eslint.config.mjs   re-exports from @repo/eslint-config
└─ src/
```

- Use the **Just-in-Time** pattern: export raw `.ts`/`.tsx` via an `exports`
  map and let the consuming app compile it (add the package to the app's
  `transpilePackages`). No per-package build step.
- Provide an explicit `exports` map. **Do not** add a barrel `index.ts` that
  re-exports everything — it breaks tree-shaking.
- React deps go in `peerDependencies`, not `dependencies`.

---

## 2. Workflow

1. Branch from `main` — short-lived, named `feat/...`, `fix/...`, `chore/...`.
2. Make the change. Keep the diff focused.
3. Run the local gate before pushing:
   ```bash
   pnpm lint && pnpm check-types && pnpm test && pnpm build
   ```
4. Open a PR. CI runs the same gate (Turborepo only rebuilds affected packages).
5. At least one approval. Squash-merge.

### Commits

Use **Conventional Commits**:

```
feat(ui): add Button loading state
fix(web): correct cache revalidation on checkout
chore(repo): bump turbo to 2.3
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`.

If a change affects a shared package's public API, add a Changeset
(`pnpm changeset`) so versioning and changelogs stay correct.

---

## 3. React rules

- **Function components and hooks only.** No class components.
- **`useEffect` is for synchronization with an external system** — nothing else.
  - Derived value → compute it during render.
  - Response to a user action → put it in the event handler.
  - Read <https://react.dev/learn/you-might-not-need-an-effect>.
- Components must be **pure during render**: no side effects, no mutation of
  props or state.
- **Composition over prop-drilling.** Reach for `children`/slots, then context,
  then a global store — in that order.
- Lift state only as high as it must go. Co-locate state with its consumer.
- Dynamic list items need **stable keys** — never the array index.
- Do not add `useMemo` / `useCallback` / `memo` without a measured reason.
- Custom hooks for reusable stateful logic; name them `useXxx`.

---

## 4. Next.js rules (App Router)

- **Server Components by default.** Add `"use client"` only on the leaf that
  needs interactivity or browser APIs, and push it as far down as possible.
- **Fetch data in Server Components**, close to where it is used.
- **Mutations go through Server Actions.** Validate every input with Zod inside
  the action. Treat all inputs as untrusted. Never reference secrets in code
  that can reach the client.
- Be explicit about caching (`fetch` options, `revalidateTag` / `revalidatePath`).
  Do not rely on remembered defaults — they differ by Next.js version.
- Use the framework file conventions: `loading.tsx`, `error.tsx`,
  `not-found.tsx`, `route.ts`, `layout.tsx`.
- Always use `next/image`, `next/font`, `next/link`. No raw `<img>` for content.
- Keep `middleware.ts` thin — it runs on every request.
- Only `NEXT_PUBLIC_*` env vars reach the client. Validate all env at startup.

---

## 5. TypeScript rules

- `strict` is on, plus `noUncheckedIndexedAccess` and `noImplicitOverride`
  (set in `@repo/typescript-config`). Do not weaken them per-package.
- **No `any`.** Use `unknown` and narrow. (`@typescript-eslint/no-explicit-any`
  is an error.)
- **Validate all external data** — API responses, env vars, form input,
  `searchParams` — with **Zod**. Derive types with `z.infer`.
- Type component props explicitly. Do not use `React.FC`.
- Use discriminated unions for variants and state machines.
- Use `import type` for type-only imports (lint-enforced).
- Co-locate types with their feature. Only truly shared types belong in a
  shared package.

---

## 6. State, data & styling

- **Server state** (data from an API): fetch in Server Components, or use
  TanStack Query in client-heavy areas. Never store server data in a client
  store (Redux/Zustand).
- **Client/UI state**: `useState` / `useReducer` → context → Zustand for
  genuinely global state.
- **URL is state**: filters, tabs, pagination live in `searchParams`.
- **Styling**: Tailwind or CSS Modules. No runtime CSS-in-JS in the App Router.

---

## 7. Testing

- Unit/component tests with **Vitest + React Testing Library** — test behavior,
  not implementation details.
- E2E with **Playwright**.
- Mock the network at the boundary with **MSW**.
- A bug fix should come with a test that fails without the fix.
- New shared-package public API needs tests before merge.

---

## 8. Naming & conventions

| Kind                       | Convention            | Example             |
| -------------------------- | --------------------- | ------------------- |
| Component file & export    | `PascalCase`          | `UserCard.tsx`      |
| Hook                       | `useXxx.ts`           | `useCartTotal.ts`   |
| Util / non-component file  | `kebab-case`          | `format-date.ts`    |
| Folder                     | `kebab-case`          | `order-history/`    |
| Boolean variable / prop    | predicate prefix      | `isOpen`, `hasError`|
| Workspace package          | `@repo/*` scope       | `@repo/ui`          |

- One feature = one folder; co-locate component, test, styles, sub-components.
- Use absolute imports (`@/...` within an app, `@repo/...` across packages).
  No `../../../` chains.
- Export explicitly. Avoid deep barrel files.

---

## 9. Definition of done

A change is ready to merge when **all** of the following hold:

- [ ] `pnpm lint` passes with zero warnings.
- [ ] `pnpm check-types` passes.
- [ ] `pnpm test` passes; new behavior is covered.
- [ ] `pnpm build` succeeds.
- [ ] No app imports another app; no package imports an app.
- [ ] External inputs are validated (Zod); no `any`.
- [ ] `"use client"` is only where interactivity genuinely requires it.
- [ ] Commits follow Conventional Commits; a Changeset exists if a shared
      package's public API changed.
- [ ] Docs updated if behavior or conventions changed.

---

## 10. Tooling reference

| Tool                  | Role                                              |
| --------------------- | ------------------------------------------------- |
| pnpm                  | Package manager + workspaces                      |
| Turborepo             | Task orchestration + caching                      |
| ESLint (flat config)  | Lint — `@repo/eslint-config`                      |
| TypeScript            | Types — `@repo/typescript-config`                 |
| Prettier              | Formatting                                        |
| Vitest / Playwright   | Testing (add per package as needed)               |
| Changesets            | Versioning shared packages (add when publishing)  |
| knip / syncpack       | Find dead code / align dependency versions        |

Questions about a rule? The reasoning is in
[`docs/best-practices.html`](docs/best-practices.html).
