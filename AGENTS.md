# Agent Guidelines for React Router 7 Template

## Build/Lint/Test Commands

- **Build**: `pnpm build` (includes typecheck)
- **Dev**: `pnpm dev` (React Router dev server)
- **Typecheck**: `pnpm typecheck` (TypeScript checking with `tsc --build`)
- **Type generation**: `pnpm typegen` (generates Cloudflare types + React Router types)
- **Deploy**: `pnpm deploy` (to Cloudflare Workers)
- **Start**: `pnpm start` (production mode with wrangler)

## Code Style & Formatting

- Uses **Prettier** with single quotes, no semicolons
- **Tailwind CSS** with proper class sorting via prettier-plugin-tailwindcss
- **TypeScript** strict mode enabled with `verbatimModuleSyntax`
- Use tabs for indentation (based on existing code)

## Import Conventions

- React Router imports from `'react-router'`
- Type imports using `import type { Route } from './+types/route'`
- Server context imports using `~/.server/context` alias
- Use named imports, no index.ts files

## React Router 7 Patterns

- Route files in `app/routes/` with `route.tsx` naming, eg `app/routes/album.$id._index/route.tsx`
- Export `meta`, `loader`, and default component from route files
- Use `Route.ComponentProps`, `Route.LoaderArgs`, etc. for typing
- Error boundaries with `ErrorBoundary` export using `Route.ErrorBoundaryProps`
