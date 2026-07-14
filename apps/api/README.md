# Portl API (NestJS Backend)

This is the backend API service for Portl, built using the NestJS framework.

## Development

You can run the API directly from the root workspace or inside this directory.

### Running from Workspace Root (Recommended)
```bash
# Start API in development mode
pnpm run dev --filter=api

# Run lint checks
pnpm run lint --filter=api

# Type-check code
pnpm run check-types --filter=api
```

### Running Locally inside `/apps/api`
```bash
# Start backend in watch mode
pnpm run dev

# Build the project
pnpm run build

# Start production server
pnpm run start:prod

# Lint code
pnpm run lint

# Typecheck
pnpm run check-types
```
