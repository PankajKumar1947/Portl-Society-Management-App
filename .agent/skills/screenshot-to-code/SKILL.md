---
name: screenshot-to-code
description: Converts screenshots (Figma, Dribbble, or web/mobile designs) into modular React/React Native components using the project's existing UI components, theme system, and folder structure. Use this skill whenever a user uploads a screenshot, design mockup, UI layout, or asks to replicate a visual design. It ensures reuse of existing components, modular file splits, and adherence to design tokens.
---

# Screenshot-to-Code Implementation Skill

## Overview
This skill guides the process of translating visual designs (from Figma, Dribbble, website screenshots, etc.) into clean, modular, and reusable React / React Native components that integrate seamlessly with the project's design system.

**Keywords**: screenshot, mockups, Figma, Dribbble, convert UI, UI reproduction, design token matching, component extraction, modular screen split

---

## Core Guidelines

### 1. Match the Existing Project Theme & Styles
When analyzing a screenshot, do not generate custom colors, hardcoded margins, fonts, or styling values. Instead:
- **Scan for Project Theme**: Read `apps/mobile/src/theme/index.ts` or the project's active design token configuration.
- **Map Visual Attributes**:
  - **Colors**: Map colors in the image to the nearest semantic theme tokens (e.g., `theme.colors.primary`, `theme.colors.background`, `theme.colors.textSecondary`).
  - **Radius & Shadows**: Map to defined radius sizes (`theme.radius.sm`, `theme.radius.md`) and shadows.
  - **Spacing**: Align padding, margins, and gaps to the project spacing scales (`theme.spacing.sm`, `theme.spacing.md`, etc.).
  - **Typography**: Match visual font sizes, weights, and lines to designated typographic levels.

### 2. Reuse Existing UI Components
Never write native `<button>`, `<input>`, or raw Touchable elements if reusable UI components exist in the workspace.
- **Identify Existing Primitives**: Locate components under `/components/ui/` or package UI kits (e.g., `<Button>`, `<Card>`, `<Input>`).
- **Use Variant and Size Props**:
  - Instead of custom style overrides:
    ```tsx
    // INCORRECT: Creating custom styling for an existing component element
    <Button style={{ backgroundColor: '#D9F20F', borderRadius: 12 }} />

    // CORRECT: Reusing existing variants and sizes
    <Button variant="primary" size="md" />
    ```
- **Consistent UI API**:
  - If writing new primitives in `/components/ui/`, structure them with proper variants and sizes (following a shadcn-like pattern with `cva` or theme-based stylesheets). Ensure these are placed in the `/components/ui/` directory.

### 3. Modular Screen Splitting (No Monoliths)
When recreating a full-page design (e.g., `landing.png` or a dashboard mockup), do not build a single giant file. 
- **Deconstruct the Design**: Identify distinct visual sections (e.g., Hero, Features, Pricing, Footer).
- **Split into Dedicated Files**: Output individual component files rather than inline render sub-functions:
  ```
  app/landing/
  ├── _components/
  │   ├── hero.tsx
  │   ├── features.tsx
  │   └── pricing.tsx
  └── index.tsx
  ```
- **Place components in correct directory**:
  - **Global/Reusable Components**: Put them under `components/ui/` or `components/`.
  - **Screen-Specific Components**: Put them in `app/[route]/_components/` (module-specific).
  - **Feature Logic-Driven Components**: Place them inside `features/[feature-name]/components/`.

---

## Step-by-Step Translation Process

1. **Analyze Design Details**:
   - Identify UI elements: buttons, form inputs, headers, list cards, icons, layouts.
   - Detect design systems indicators: approximate shadows, spacings, primary accents.
2. **Review Codebase Inventory**:
   - Check local theme constants and stylesheet mappings.
   - Check available component files to find matching components.
3. **Draft the Code Structure Plan**:
   - Outline the files to be created (e.g., page file and section components).
4. **Implement and Verify**:
   - Write components using kebab-case file names (`hero-section.tsx`).
   - Standardize props, variants, and colors.
