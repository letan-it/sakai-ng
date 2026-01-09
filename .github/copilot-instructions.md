# GitHub Copilot Instructions for Sakai-NG

This document provides custom instructions for GitHub Copilot when working on the Sakai-NG project.

## Language Preference

- **Response Language**: Always respond in Vietnamese (Tiếng Việt)
- Provide explanations, comments, and documentation in Vietnamese
- Code comments should be written in Vietnamese when added

## Project Overview

Sakai-NG is an Angular 20 application built with:
- **Framework**: Angular 20 (standalone components)
- **UI Library**: PrimeNG 20
- **CSS Framework**: Tailwind CSS 4.1
- **Theme System**: PrimeUI Themes
- **Build Tool**: Angular CLI 20

## Code Style and Formatting

## Modal / Dialog Conventions (PrimeNG)

- All **Dialogs/Modals** were created using PrimeNG (`p-dialog`, `DialogService`, DynamicDialog)
  **BẮT BUỘC** The following default style is required:

### Required Styles

- `maskStyleClass="backdrop-blur-sm"`
- `styleClass="!border-0"`

### Template Example

```html
<p-dialog
    [(visible)]="visible"
    header="Tiêu đề"
    modal="true"
    maskStyleClass="backdrop-blur-sm"
    styleClass="!border-0"
>
    <!-- Nội dung modal -->
</p-dialog>


### TypeScript

- **Indentation**: 4 spaces (no tabs)
- **Quotes**: Single quotes (`'`) for strings
- **Semicolons**: Always required
- **Line Width**: Maximum 250 characters
- **Trailing Commas**: None
- Use strict TypeScript settings (enabled in tsconfig.json)
- Enable experimental decorators
- Use ES2022 target and module format

### Code Organization

- Always add blank lines before `return` statements
- Add blank lines before and after block statements
- Add blank lines after imports and before first const/let/var
- Consecutive variable declarations don't need blank lines between them

### Angular Conventions

- **Component Selector Prefix**: Use `app-` prefix for element selectors (kebab-case)
  - Note: ESLint config specifies `p-` prefix, but the codebase uses `app-` prefix consistently
- **Directive Selector Prefix**: Use `app` prefix for attribute selectors (camelCase)
- **Component Class Suffix**: No suffix required (configured to allow empty suffix)
- **Components**: Use standalone components (no NgModule)
  - Include `standalone: true` in component decorator when needed
- **File Names**: Prefer lowercase without .component suffix (e.g., `dashboard.ts`)
  - Some legacy files may still use `.component.ts` suffix
- **Imports**: Place all component dependencies in the `imports` array

### Template Conventions

- Use inline templates for simple components
- Use Tailwind CSS utility classes for styling
- Use PrimeNG components following PrimeNG 20 conventions
- Use strict template checking
- Always use `===` and `!==` (allow null/undefined checks with `==`/`!=`)

### Class Member Ordering

Follow this order in class definitions:
1. Public static fields
2. Static fields
3. Instance fields
4. Public instance methods
5. Public static fields (repeated for consistency)

### Path Aliases

Use `@/*` alias for importing from `src/app/*`:
```typescript
import { SomeComponent } from '@/pages/dashboard/dashboard';
```

## Architecture Patterns

### Component Structure

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-component-name',
    imports: [CommonModule],
    template: `
        <div class="card">
            <!-- Component template -->
        </div>
    `
})
export class ComponentName {}
```

### Standalone Components

- All components should be standalone (no NgModule)
- Include `standalone: true` in the component decorator when required
- Import dependencies directly in the component's `imports` array

### Layout Structure

- Main layout components go in `src/app/layout/`
- Page components go in `src/app/pages/`
- Reusable widgets go in component-specific subdirectories

## Styling Guidelines

### Tailwind CSS

- Use Tailwind utility classes for all styling
- Leverage Tailwind grid system: `grid`, `grid-cols-12`, `gap-8`, etc.
- Use responsive prefixes: `lg:`, `xl:`, etc.
- Use dark mode variants: `dark:text-surface-0`

### Common Patterns

```html
<!-- Card container -->
<div class="card">
    <!-- Content -->
</div>

<!-- Grid layout -->
<div class="grid grid-cols-12 gap-8">
    <div class="col-span-12 lg:col-span-6">
        <!-- Content -->
    </div>
</div>

<!-- Flex utilities -->
<div class="flex justify-between items-center">
    <!-- Content -->
</div>
```

### PrimeNG Integration

- Use PrimeNG components from the `primeng` package
- Use PrimeIcons for icons: `<i class="pi pi-icon-name"></i>`
- Follow PrimeUI theming conventions
- Use semantic color classes: `text-primary`, `text-muted-color`, `bg-blue-100`

## ESLint Rules to Follow

- Use arrow functions where possible (`arrow-body-style: as-needed`)
- No console warnings (console.log is allowed)
- Prefer const is optional (can use let freely)
- No curly brace enforcement for single-line if statements
- Strict member ordering (follow the pattern above)
- No host metadata property restrictions
- No output `on` prefix restrictions

## Best Practices

### Component Design

1. Keep components focused and single-purpose
2. Use inline templates for simple components
3. Extract reusable widgets into separate components
4. Place related components in subdirectories (e.g., `dashboard/components/`)

### TypeScript

1. Use TypeScript strict mode features
2. Avoid explicit `any` type (disabled, but use sparingly)
3. Use type inference where possible
4. Enable strict input access modifiers
5. Use isolated modules

### Imports

1. Group imports logically:
   - Angular core imports first
   - Angular common imports second
   - Third-party libraries
   - Local components/services
2. Always add blank line after import statements

### Performance

1. Use OnPush change detection where appropriate
2. Avoid unnecessary re-renders
3. Use trackBy functions for *ngFor loops
4. Lazy load routes when possible

## Development Commands

```bash
# Start development server
npm start
# or
ng serve

# Build for production
npm run build
# or
ng build

# Run tests
npm test
# or
ng test

# Format code
npm run format

# Watch mode (rebuild on changes)
npm run watch
```

## File Naming Conventions

- Component files: `componentname.ts` (lowercase, no .component suffix)
- Service files: `servicename.service.ts`
- Model files: `modelname.model.ts`
- Use kebab-case for multi-word file names

## Additional Notes

- This project uses Angular 20's latest features including standalone components
- The component class suffix is intentionally empty to allow flexibility
- The codebase uses `app-` prefix for selectors, overriding the ESLint rule that specifies `p-`
- Tailwind CSS is configured with PrimeUI integration
- Use Chart.js (v4.4.2) for data visualizations
- RxJS (~7.8.2) for reactive programming patterns

## When Generating Code

1. Always use standalone components
2. Include necessary imports in the component decorator
3. Use inline templates for simple components
4. Apply Tailwind CSS classes for styling
5. Follow the established file structure (pages, layout, components)
6. Use PrimeNG components when building UI elements
7. Ensure code passes ESLint rules defined in eslint.config.js
8. Format code according to .prettierrc.json settings
9. Use TypeScript strict mode conventions
10. Add appropriate blank lines according to padding-line-between-statements rules
