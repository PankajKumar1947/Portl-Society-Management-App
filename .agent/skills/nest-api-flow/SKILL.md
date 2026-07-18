---
name: nest-api-flow
description: Step-by-step instructions and patterns for creating new NestJS REST API endpoints and database logic, including Zod schemas, DTOs, Mongoose entities, repositories, and Swagger decorators.
---

# NestJS API Creation Flow

Use this skill when asked to create new REST endpoints, modules, services, repositories, or data schemas in the backend (`apps/api`). It ensures consistency, type safety, and clean separation of concerns.

---

## Architecture Blueprint

Every new API resource must follow this layered structure:

```
[Client] -> [Controller (Zod & Swagger)] -> [Service (Business Logic)] -> [Repository (Db Queries)] -> [Mongoose Model]
                 ^
                 +-- validate via DTOs (Zod Schema in @repo/schema)
```

---

## Step-by-Step Implementation Guide

### Step 1: Define validation schemas in `@repo/schema`
All payloads (Requests, Params, Queries) must be validated via Zod schemas inside the shared package:
1. Define the Zod schema in the appropriate sub-module under `packages/schema/src/`.
2. Export the inferred TypeScript types.
3. Build the package so it compiles to `dist/`:
   ```bash
   pnpm --filter @repo/schema build
   ```

### Step 2: Create DTOs in NestJS
In the `dto/` directory of your API module, create Zod-backed DTO classes:
* Use `createZodDto` from `nestjs-zod`.
* **Standard 1 (Explicit Declarations)**: Do NOT use TypeScript declaration merging. Declare class properties explicitly with `!` to satisfy ESLint and compile checks:
  ```typescript
  import { createZodDto } from 'nestjs-zod';
  import { CreateEntitySchema } from '@repo/schema';

  export class CreateEntityDto extends createZodDto(CreateEntitySchema) {
    name!: string;
    email!: string;
  }
  ```
* For updates, extend `CreateEntityDto` using Swagger's `PartialType` helper:
  ```typescript
  export class UpdateEntityDto extends PartialType(CreateEntityDto) {}
  ```

### Step 3: Define Mongoose Entity
In the `entities/` folder of your API module:
* Define Mongoose models using NestJS `@Prop()` decorators.
* If instance methods (like `comparePassword`) or pre-save hooks are needed, add their signatures directly inside the class definition to prevent ESLint `unsafe-call` warnings.

### Step 4: Implement Repository Layer
* Create `[entity].repository.ts` to isolate raw Mongoose model interactions (like `.find()`, `.findOne()`, etc.).
* Inject the repository into the Service layer rather than injecting the raw model directly.

### Step 5: Implement Service Layer
* Create `[entity].service.ts` to execute domain business workflows.
* Inject repositories and other services in the constructor.

### Step 6: Define Controllers and Swagger Docs
To keep controllers readable, separate endpoint metadata (Swagger docs) from endpoint routing logic:
1. **Create Docs Decorator File** (`[entity].docs.ts`):
   Group Swagger OpenAPI metadata using `applyDecorators`:
   ```typescript
   export function ApiCreateEntity() {
     return applyDecorators(
       ApiOperation({ summary: 'Create new record' }),
       ApiResponse({ status: 201, description: 'Created successfully.' }),
     );
   }
   ```
2. **Implement Controller** (`[entity].controller.ts`):
   Use the Zod validation pipe and custom doc decorators:
   ```typescript
   @Controller('resource')
   @UsePipes(new ZodValidationPipe())
   export class EntityController {
     constructor(private readonly service: EntityService) {}

     @Post()
     @ApiCreateEntity()
     async create(@Body() dto: CreateEntityDto) {
       return this.service.create(dto);
     }
   }
   ```

### Step 7: Module Registration
* Define and register imports, controllers, providers, and exports in `[entity].module.ts`.
* Import the module inside `app.module.ts`.
