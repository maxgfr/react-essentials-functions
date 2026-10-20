# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Overview

Zero-dependency collection of React hooks and components. Peer deps: React >=17. Published on npm as `react-essentials-functions`.

## Commands

Package manager is **pnpm** (never use npm or yarn).

```bash
pnpm install            # install dependencies
pnpm test               # run all tests (jest)
pnpm test -- --testPathPattern=useHover  # run a single test file
pnpm test:watch         # watch mode
pnpm test:coverage      # with coverage report
pnpm typecheck          # type-check without emitting (tsc --noEmit)
pnpm lint               # eslint on src/
pnpm format             # prettier write
pnpm format:check       # prettier check
pnpm build              # compile to ./build/ (CommonJS + .d.ts)
pnpm ci                 # full CI pipeline: typecheck + lint + format:check + test:coverage
```

## Architecture

```
src/
  index.ts              → re-exports from ./hooks and ./components
  hooks/
    index.ts            → barrel file, re-exports all hooks (alphabetical order)
    useXxx.tsx          → hook implementation
    useXxx.test.tsx     → co-located test file
  components/
    index.ts            → barrel file, re-exports all components
    ComponentName.tsx   → component implementation
    ComponentName.test.tsx
```

Build output goes to `./build/` (CommonJS, `package.json` `main` points to `./build/index.js`, `types` to `./build/index.d.ts`). Only `build/` is published to npm.

## Conventions for adding a new hook

1. Create `src/hooks/useXxx.tsx` — named `export function` (not default export, not `export const`)
2. Create `src/hooks/useXxx.test.tsx` — Jest + `@testing-library/react` (`renderHook`, `act`)
3. Add `export * from './useXxx';` to `src/hooks/index.ts` (keep alphabetical)
4. **Always update `README.md`**: add entry in Table of Contents + full section (Parameters, Returns, Side effects, Example)
5. Export any new types from the hook file and add them to the TypeScript types section in README
6. Run `pnpm format` before committing to fix Prettier issues

**IMPORTANT: The README.md must always be kept in sync with the code. Any addition, modification, or removal of a hook/component must be reflected in the README.**

Key patterns used across all hooks:
- SSR guards: `typeof window === 'undefined'` / `typeof document === 'undefined'`
- `useCallback` for returned functions (referential stability)
- `useRef` for storing latest callback to avoid re-subscribing listeners
- Cleanup in `useEffect` return for all listeners/observers/timers
- JSDoc with `@param`, `@returns`, `@example`
- Graceful degradation with try/catch for browser APIs that may throw

## Releases

Automated via `semantic-release` on `main` branch. Commit messages must follow conventional commits (`fix:`, `feat:`, `chore:`, etc.).
