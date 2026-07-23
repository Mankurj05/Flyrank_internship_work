# CLAUDE.md

## Build and Run Commands
- Dev Server: `npm run dev`
- Production Build: `npm run build`
- Install Dependencies: `npm install`
- Run Tests: `npm test`

## Project Stack & Structure
- Core: Node.js (LTS), HTML5, CSS3, Vanilla Javascript
- Styling: Custom Vanilla CSS
- Architecture: Component-based, modular structure
- Conventions: Conventional Commits 1.0.0

## Code Style & Conventions
- Semantic HTML and SEO best practices (meta tags, clean document outline).
- Responsive, modern UI designs with rich aesthetics (no default/unstyled pages).
- Descriptive variable and function names (camelCase for variables, PascalCase for classes/components).
- Clean, documented code with clear comments explaining non-trivial logic.
- Avoid using external CSS frameworks unless explicitly configured.
- **Validation Isolation:** Isolate all business and validation logic from DOM interactions in separate, exportable modules (e.g., `validation.js`) to ensure they can be unit-tested via Node without a DOM environment.
- **Accessible & Clean Forms:** All user-facing forms must use the `<form novalidate>` attribute, include explicit `autocomplete` hints, and connect inputs dynamically to error containers using `aria-describedby` and `role="alert"`.
- **CSS State Management:** Toggle application states (e.g., success, errors) by modifying CSS classes (e.g., `.success`, `.error`) rather than hardcoding style properties in JavaScript.
