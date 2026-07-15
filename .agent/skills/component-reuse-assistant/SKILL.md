---
name: component-reuse-assistant
description: Finds and recommends the best existing component in the workspace for a given requirement. Use this skill when asked to create new UI elements, build layouts, design screens, or refactor interfaces. It ensures we avoid code duplication, maintain visual consistency, and extend existing components instead of writing duplicates.
---

# Component Reuse Assistant Guidelines

## Overview
This skill ensures we maximize the reuse of existing components in the repository before writing any new UI code. Creating duplicate components leads to codebase bloat, inconsistent styles, and maintenance overhead.

**Keywords**: component reuse, component search, locate existing component, duplicate prevention, extends component, UI consistency, code deduplication

---

## Core Guidelines

### 1. Proactive Search Phase
Before writing any new component, you must search the codebase for existing implementations:
- **Search Locations**:
  - `packages/ui/src/` (for common design system primitives)
  - `components/` & `components/ui/` (for shared application components)
  - `features/*/components/` (for domain-specific components that could be repurposed or refactored to be reusable)
- **Search Method**:
  - Run name-based file searches or grep searches for keywords matching the desired UI element (e.g., `button`, `card`, `modal`, `dialog`, `badge`, `chip`, `input`, `avatar`, `list-item`, `spinner`, `dropdown`).

### 2. Compare and Evaluate Candidates
Identify potential candidates and analyze their code:
- Check their defined Props/Interfaces to see if they support the necessary configuration (e.g. icons, colors, events).
- Compare their visual layout and behavior to the requested design.

### 3. Strategy: Extend Over Duplicate
If an existing component matches 80% of the requirements but is missing a specific style, prop, or variant:
- **Do not create a duplicate component.**
- **Extend the existing component**:
  - Add the missing prop as an optional property.
  - Implement the new variant or visual style option within the existing component configuration (e.g., via Tailwind configuration, CSS classes, stylesheet variants, or component prop-based condition).
  - Ensure you preserve backward compatibility so that existing uses of the component elsewhere in the codebase do not break.

### 4. When to Create a New Component
If and only if no suitable component exists after research:
- For general-purpose, non-business-logic primitives, create the component under `components/ui/` or `packages/ui/`.
- For feature-specific/domain-rich components, place them in `features/[feature-name]/components/`.
- Make the new component flexible and configurable so that future developers can reuse it.

---

## Action Plan for Component Inquiries

When the user asks to implement a visual element (e.g., "Add a card that displays X" or "Create a button for Y"):
1. Search the codebase for similar components.
2. List the best matching components found (with file links and lines).
3. Recommend how to reuse or extend them.
4. Present this to the user before writing the code.
