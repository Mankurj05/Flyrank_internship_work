# CineSeek - Movie Search Application Submission

CineSeek is a feature-rich, high-performance React application designed for discovering movies and TV shows using the OMDb API (API Key: `9e2e7655`).

## Prompts Used During Development

1. **Scaffold Prompt (precise setup)**:
   > "Create a React + Vite application configuration in the current directory without using interactive commands. The app requires `react`, `react-dom`, and `lucide-react` for iconography. Ensure we do not overwrite existing git history."
2. **Component Architecture Prompt**:
   > "Build a modular CineSeek React application. Create an isolated `MovieCard` component showing poster, title, year, type with custom SVG icons, and a favoriting action. Create a `MovieDetailModal` that fetches full movie profiles (directors, actors, ratings, full plot outline) by IMDb ID when a card is clicked. Isolate OMDb API calls and use React state hooks in `App.jsx` for search, filtering by type, sorting by year/title, and local storage state persistence."
3. **Design Aesthetics Prompt**:
   > "Style the CineSeek layout using premium dark mode guidelines: a linear gradient background, glassmorphism card effects (`backdrop-filter`), smooth hover animations, custom scrollbars, and clear visual state grids for loading, error, or empty states."

---

## How AI Assisted Throughout the Implementation

- **Scaffold & Build Setup**: The AI successfully created the manual configurations for `package.json` and `vite.config.js` to build a clean Vite environment without disturbing the existing git repository.
- **Component Skeleton Drafting**: The AI generated the layout structure and HTML outlines, including linking properties (props) between parent (`App.jsx`) and children (`MovieCard.jsx`, `MovieDetailModal.jsx`).
- **CSS Grid & Flexbox Scaffolding**: Drafting the responsive layout system and styling class rules for card hover transforms.

---

## Examples of Manual Improvements and Refactoring

During code review of the AI's drafts, the following manual improvements were implemented:

1. **Modularizing validation utilities**:
   - *Issue:* The AI initially embedded validation and search verification routines directly inside `App.jsx`.
   - *Correction:* Extracted validation rules into an independent module (`validation.js`) to allow standalone terminal unit testing (`node test-validation.js`).
2. **Graceful Poster Failbacks**:
   - *Issue:* When OMDb returns `Poster: "N/A"`, the image breaks or displays empty boxes.
   - *Correction:* Added a conditional ternary operator that swaps missing posters with a high-quality cinema placeholder image from Unsplash.
3. **Scroll Lock and Keyboard Listeners**:
   - *Issue:* Opening the detail modal left the main body scrollable behind the overlay, creating a disorienting user experience.
   - *Correction:* Added `document.body.style.overflow = 'hidden'` on mount and restored it on unmount in `useEffect`. Also added a keydown listener to trigger `onClose` when the user presses the `Escape` key.
