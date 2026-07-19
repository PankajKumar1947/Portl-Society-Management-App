---
name: mobile-api-integration
description: Step-by-step instructions for integrating new backend REST API endpoints into the mobile app. Covers api-client route functions, React Query mutation hooks in the operations package, and wiring screens with the mutate pattern. Use this skill when asked to connect a mobile screen to an API endpoint, add a new API call to the mobile app, or create mutation/query hooks.
---

# Mobile API Integration Flow

Use this skill when connecting any screen in `apps/mobile` to a backend API endpoint. It ensures a consistent, type-safe integration across the four layers: Schema Types → API Client → Operations Hooks → Screen.

---

## Architecture Overview

```
@repo/schema          (request/response types)
      ↓
@repo/api-client      (axios route functions + query keys)
      ↓
@repo/operations      (React Query mutation/query hooks)
      ↓
apps/mobile screen    (uses hooks with mutate pattern)
```

---

## Step-by-Step Guide

### Step 1: Define Response Types in `@repo/schema`

In `packages/schema/src/<domain>/<domain>.type.ts`, add the API response type:

```typescript
export type CreateEntityData = {
  message: string;
  id: string;
};
```

Export it from the domain `index.ts` file.

---

### Step 2: Register the Endpoint in `@repo/api-client`

#### 2a. Add query key + endpoint in `react-queries/<domain>/index.ts`:

```typescript
export const entityQueries = {
  create: {
    key: ["create-entity"],
    endpoint: "/entity",
  },
} as const;
```

#### 2b. Add the API function in `routes/<domain>/index.ts`:

```typescript
import { CreateEntityBody, CreateEntityData } from "@repo/schema";
import { entityQueries } from "../../react-queries/entity";
import { apiClient } from "../../services/axios-instance";

export const createEntity = async (data: CreateEntityBody): Promise<CreateEntityData> => {
  const res = await apiClient.post(entityQueries.create.endpoint, data);
  return res.data;
};
```

#### 2c. Export everything from `packages/api-client/src/index.ts`:

```typescript
export * from "./react-queries/entity";
export * from "./routes/entity";
```

---

### Step 3: Create Mutation/Query Hooks in `@repo/operations`

#### 3a. Mutation Hooks (For write actions: POST, PUT, DELETE)
In `packages/operations/src/mutation/use-<domain>.ts`:

```typescript
import { useMutation } from "@tanstack/react-query";
import { createEntity, entityQueries } from "@repo/api-client";
import { CreateEntityBody } from "@repo/schema";

export const useCreateEntity = () => {
  return useMutation({
    mutationKey: entityQueries.create.key,
    mutationFn: (data: CreateEntityBody) => createEntity(data),
  });
};
```

> [!TIP]
> For operations that should auto-store tokens on success (e.g. login/verify), handle side effects in the `onSuccess` callback inside the hook — **not** in the screen.

#### 3b. Query Hooks (For read actions: GET, Paginated list, Infinite Scroll)
In `packages/operations/src/query/use-<domain>.ts` or directly exported from `packages/operations/src/`:

```typescript
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  PaginationQuery,
  FetchEntitiesResponse,
  Entity,
  EntityDetailResponse,
} from "@repo/schema";
import { entityQueries } from "@repo/api-client";
import { getEntities, getEntityDetails } from "@repo/api-client";

interface UseGetEntitiesParams extends Partial<PaginationQuery> {
  enabled?: boolean;
}

// 1. Standard paginated query hook
export const useGetEntities = (params?: UseGetEntitiesParams) => {
  const { enabled = true, page = 1, limit = 100, ...rest } = params || {};

  return useQuery({
    queryKey: [
      ...entityQueries.getEntities.key,
      { page, limit, ...rest },
    ],
    queryFn: () => getEntities({ page, limit, ...rest }),
    select: (response: FetchEntitiesResponse): Entity[] =>
      response.data.items,
    enabled,
  });
};

// 2. Infinite scroll/query hook
export const useGetEntitiesInfinite = (params?: {
  enabled?: boolean;
  search?: string;
}) => {
  const { enabled = true, search } = params || {};
  const limit = 20;

  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: [...entityQueries.getEntities.key, "infinite", { search }],
    queryFn: ({ pageParam }) =>
      getEntities({ page: pageParam as number, limit, search }),
    getNextPageParam: (lastPage: FetchEntitiesResponse) =>
      lastPage.data.hasNext ? lastPage.data.currentPage + 1 : undefined,
    enabled,
  });
};

// 3. Single resource detail query hook
export const useGetEntityDetail = (entityId: string) => {
  return useQuery({
    queryKey: entityQueries.getEntityDetail(entityId).key,
    queryFn: () => getEntityDetails(entityId),
    select: (response: EntityDetailResponse) => response.data.entity,
    enabled: !!entityId,
  });
};
```

Export the hooks from `packages/operations/src/index.ts`:

```typescript
export * from "./mutation/use-<domain>";
export * from "./query/use-<domain>";
```

---

### Step 4: Wire up the Mobile Screen

#### Standard Pattern — use `mutate` + `isPending`:

```typescript
const { mutate: createEntity, isPending: isSubmitting } = useCreateEntity();

const onSubmit = (data: CreateEntityBody) => {
  createEntity(data, {
    onSuccess: (res) => {
      // Navigate or show success
      router.push({ pathname: Routes.Entity.Detail, params: { id: res.id } });
    },
    onError: (err) => {
      const apiError = err as unknown as ApiErrorResponse;
      Alert.alert("Error", apiError.message);
    },
  });
};
```

#### Error Handling with Status Codes:

Instead of string matching on `err.message`, use `ApiErrorResponse.status` and `data`:

```typescript
import type { ApiErrorResponse } from "@repo/api-client";

onError: (err) => {
  const apiError = err as unknown as ApiErrorResponse;

  if (apiError.status === 401 && (apiError.data as { emailVerified?: boolean })?.emailVerified === false) {
    router.push(Routes.Auth.Verify);
    return;
  }
  Alert.alert("Failed", apiError.message);
},
```

> [!IMPORTANT]
> Always use `apiError.status` (HTTP status code) for branching logic — never use `err.message.includes(...)` string matching.

---

### Step 5: Ensure Dependencies Are Declared

Check that `apps/mobile/package.json` includes the workspace packages used:

```json
"@repo/api-client": "workspace:^",
"@repo/operations": "workspace:^",
"@repo/schema": "workspace:^"
```

If missing, add them and run `pnpm install` from the monorepo root.

---

## Verification Checklist

- [ ] Schema types defined and exported
- [ ] Query key + endpoint added to `react-queries/<domain>/index.ts`
- [ ] API function added to `routes/<domain>/index.ts`
- [ ] Hook created in `operations/src/mutation/use-<domain>.ts` and exported from `index.ts`
- [ ] Screen uses `mutate` + `isPending` pattern with `onSuccess`/`onError` callbacks
- [ ] Errors handled via `ApiErrorResponse.status` (not string matching)
- [ ] `pnpm check-types` passes with zero errors
