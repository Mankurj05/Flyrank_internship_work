# Accessible Components Analysis: Custom vs. shadcn/ui

This document reviews the differences between our custom-built accessible components and the open-source Radix UI-based components used by shadcn/ui.

---

## 1. Dialog / Modal Component Comparison

### Gaps Handled by shadcn/ui (Radix UI Dialog)
1. **React Portal Rendering**:
   - *Custom Modal:* Mounted inline where the component is declared in the React tree. This can lead to CSS inheritance issues (like parent containers having `overflow: hidden` or custom z-indices clipping the modal).
   - *shadcn/ui:* Renders through a `Portal` (`DialogPortal`) directly at the end of the `<body>` element. This ensures the modal overlay is always on the top layer and detaches it from container-level styling constraints.
2. **Accessible Screen Reader Hiding (`aria-hidden`)**:
   - *Custom Modal:* Only declares `role="dialog"` and `aria-modal="true"`. However, screen readers might still allow users to swipe focus to background contents outside the modal.
   - *shadcn/ui:* Radix automatically sets `aria-hidden="true"` on all sibling elements of the portal root when the dialog is active. This completely hides the rest of the web application from screen readers, ensuring focus and narration remain strictly in the dialog.
3. **Scroll Lock Restorations**:
   - *Custom Modal:* Hardcodes `document.body.style.overflow = 'hidden'`. If multiple overlapping modals are mounted and unmounted, this state can get desynchronized, leaving the background permanently scroll-locked.
   - *shadcn/ui:* Uses a refined pointer-events scroll lock wrapper (`react-remove-scroll`) that tracks the count of open modals, preventing background scrolling and managing padding shifts to prevent layout layout-shifts when scrollbars disappear.

---

## 2. Tabs Component Comparison

### Gaps Handled by shadcn/ui (Radix UI Tabs)
1. **Activation Choices**:
   - *Custom Tabs:* Implements automatic activation (focusing the tab via arrow key instantly renders its contents).
   - *shadcn/ui:* Exposes a `activationMode` configuration (choice between `"automatic"` and `"manual"`). Manual activation is critical for heavy tabs where content shouldn't reload/mount immediately just by keyboard cycling.
2. **Dynamic Orientation**:
   - *Custom Tabs:* Only supports horizontal keyboard ArrowRight/ArrowLeft navigation.
   - *shadcn/ui:* Radix supports vertical tabs layouts out of the box, converting arrow key listeners automatically to ArrowDown/ArrowUp depending on the `orientation` property.
3. **RTL (Right-to-Left) Support**:
   - *shadcn/ui:* Evaluates the document writing direction. In RTL configurations, ArrowRight and ArrowLeft key navigation directions are correctly inverted.

---

## 3. General Lessons Learned
- **Ref callbacks vs. DOM queries**: Our custom focus trap queried the DOM directly via selector matching (`modalRef.current.querySelectorAll`). This can fail if a modal contains Web Components or complex shadows. Radix uses internal ref tracking and React synthetic event hierarchies.
- **State-driven animations**: shadcn hooks onto Radix's state attributes (`data-[state=open/closed]`) to trigger Tailwind keyframe animations. This makes animating transitions elegant and predictable without complex hook-based unmount timers.
