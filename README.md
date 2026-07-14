# Portl Monorepo

This is the Turborepo monorepo for Portl, containing backend services, a mobile application, and shared package utilities.

## Workspace Architecture

### Apps
- `apps/api`: [NestJS](https://nestjs.com/) backend API.
- `apps/mobile`: [Expo](https://expo.dev/) mobile application (React Native).

### Shared Packages (in `packages/*`)
- `@repo/api-client`: Shared Axios client for API consumption.
- `@repo/operations`: React Query mutations and queries utilizing the api-client.
- `@repo/schema`: Common validation schemas and TypeScript types (using [Zod](https://zod.dev/)).
- `@repo/ui`: Shared React Native / React web UI component library.
- `@repo/eslint-config`: Shared ESLint configurations.
- `@repo/typescript-config`: Shared TypeScript compiler configurations.

---

## Monorepo Tasks

All core developer tasks are run through Turborepo from the root directory.

### Build
To build all applications and packages (caching build outputs like NestJS compilation and Expo exports):
```sh
pnpm run build
```

### Development
To start development servers for all apps in watch mode:
```sh
pnpm run dev
```

To run a specific application (e.g., the NestJS backend):
```sh
pnpm run dev --filter=api
```

### Type Checking
To type-check the entire codebase:
```sh
pnpm run check-types
```

### Linting
To run ESLint across all workspaces:
```sh
pnpm run lint
```

### Formatting
To format the codebase using Prettier:
```sh
pnpm run format
```

---

## Useful Links

Learn more about the power of Turborepo:
- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
# Portl-Society-Management-App
