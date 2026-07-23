# Portl Monorepo Rules

## apps/mobile
- **Expo HAS CHANGED:** Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code in this directory.

## Custom Agent Skills Integration
- **Code Organization & Structure**: You must use the `smart-code-architecture` skill when asked to create, refactor, or organize directories, features, components, and layout files.
- **UI Design & Screenshot Translation**: You must use the `screenshot-to-code` skill when provided with layout designs, Figma, Dribbble, or web/mobile mockup images, or asked to recreate visuals.
- **Deduplication & Reusability**: You must use the `component-reuse-assistant` skill when creating any new UI component or page layout to verify existing components first and prevent code duplication.
- **Brand Identity & Colors**: You must use the `brand-guidelines` skill when generating assets, formatting artifacts, or applying Portl-specific branding colors and typography.
- **Frontend Design & Aesthetics**: You must use the `frontend-design` skill when designing new interfaces, choosing layouts, establishing typography, or ensuring high-quality, non-templated visual design.
- **Backend API Creation**: You must use the `nest-api-flow` skill when creating new NestJS REST endpoints, modules, services, repositories, DTOs, entities, or Swagger documentation.
- **Mobile API Integration**: You must use the `mobile-api-integration` skill when connecting a mobile screen to a backend API, adding API route functions, creating React Query mutation/query hooks in the operations package, or wiring screens with the mutate pattern.
## General Coding Guidelines
- **Strict Typing (TypeScript)**: Always use strong, correct TypeScript types. Never use `any` as a type under any circumstances.
- **Code Comments**: Do not add garbage, placeholder, or obvious boilerplate comments (e.g. "// Populate formValues once guard details load", "// Stepper indicator"). Only write clean, explanatory comments for non-obvious business logic.
