---
name: smart-code-architecture
description: Guidelines and structure patterns for organizing codebase folders, features, hooks, components, and naming files in the application. Use this skill whenever a user asks to create, refactor, or structure code components, directories, or layout in the project. It ensures modularity, clean separations of concerns, and consistent naming conventions.
---

# Smart Code Architecture Guidelines

## Overview

When creating new features, refactoring existing code, or structuring the codebase, always follow these organization rules to maintain a highly modular, readable, and scalable codebase.

**Keywords**: folder structure, architecture, directories, component organization, file naming, kebab-case, refactoring, code structure, folder layout

---

## Directory Structure

Rather than putting all components and files in one directory, organize them according to the following layout:

```
src/ (or root folder)
├── app/                  # Main screens and route definitions (Expo Router / Next.js)
│   ├── (auth)/           # Route group (e.g., authentication)
│   │   ├── login.tsx     # Page screen
│   │   └── signup.tsx
│   └── _components/     # Module-specific, non-reusable components for this route/module
│       └── login-form.tsx
├── components/           # Reusable global UI components (shared across multiple features/routes)
│   ├── button.tsx
│   └── card.tsx
├── features/             # Feature-specific modules (each feature encapsulates its state, logic, APIs, and sub-components)
│   ├── visitors/         # Example feature: Visitor management
│   │   ├── api/          # Feature-specific queries and mutations
│   │   ├── components/   # Feature-specific UI components
│   │   ├── hooks/        # Feature-specific hooks
│   │   └── state/        # Feature-specific state (e.g., Zustand slices)
│   └── amenities/
├── hooks/                # Reusable global custom hooks (shared across features)
│   ├── use-auth.ts
│   └── use-debounce.ts
├── lib/                  # Third-party client instances and configurations (e.g., Axios client, Supabase, Firebase)
│   └── api-client.ts
├── utils/                # Pure utility functions and helper methods
│   ├── date-formatter.ts
│   └── string-utils.ts
└── constants/            # Shared constants, enums, config values
    ├── api-endpoints.ts
    └── theme-constants.ts
```

---

## Directory Roles & Guidelines

### 1. `app/`
- Contains the main application routes, pages, and entry points.
- Structure mirrors the URL or navigation hierarchy.

### 2. `app/_components/`
- Contains **module-specific, non-reusable** UI components.
- Components placed here should *only* be used within their parent folder’s routes.
- Example: `app/(tabs)/home/_components/hero-banner.tsx`.

### 3. `components/`
- Contains **reusable global UI components** (e.g., Design System elements like inputs, loaders, cards, buttons).
- These components are generic, highly configurable via props, and do not contain domain-specific business logic.

### 4. `features/`
- Groups code by vertical domain features rather than horizontal technical types.
- A feature folder is self-contained: it houses the feature's API calls, specific components, custom hooks, and state management.
- Example: `features/visitors/components/visitor-card.tsx` or `features/visitors/hooks/use-visitor-mutation.ts`.

### 5. `hooks/`
- Contains global, generic custom hooks that are shared across different features or routes (e.g., `useDebounce`, `useTheme`, `useLocalStorage`).

### 6. `lib/`
- Houses initializations and configurations of external libraries.
- Examples: client setups for Apollo, Axios, Firebase, or WebSocket providers.

### 7. `utils/`
- Contains pure helper functions (input -> output) without side effects.
- Examples: date formatting, currency calculation, string manipulation.

### 8. `constants/`
- Houses static values, configurations, theme structures, keys, and schemas.

---

## Naming Conventions

### File Naming
- **Components & Files**: All file names must use **kebab-case** (lowercase with words separated by hyphens).
  - *Correct*: `visitor-card.tsx`, `use-visitor-mutation.ts`, `custom-input.tsx`
  - *Incorrect*: `VisitorCard.tsx`, `useVisitorMutation.ts`, `CustomInput.tsx`

### Directory Naming
- Folders under `app/`, `features/`, `components/`, etc. should be lowercase and follow kebab-case if multiple words are used (e.g., `visitor-management/`).
