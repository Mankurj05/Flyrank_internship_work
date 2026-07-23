# Development Workflow: Vague vs. Precise Prompts

This document analyzes the differences between two development approaches used to build a Settings Form feature.

## Comparison Table

| Metric | Round One (Vague Prompt) | Round Two (Precise Prompt + Verification Loop) |
| :--- | :--- | :--- |
| **Development Time** | ~2 minutes | ~5 minutes |
| **Code Modularity** | None (coupled to DOM) | High (isolated `validation.js` module) |
| **Validation Rigor** | Simple presence check (`!username`) | Strict validations (length, regex, password strength) |
| **Accessibility (a11y)**| Standard inputs, no screen-reader assistance | Semantic HTML, ARIA attributes, error roles, skip links |
| **Testability** | Impossible without DOM/browser mock | Automated suite (`test-validation.js`) runnable via Node |

---

## Core Findings

### 1. Correctness and Edge Cases
In **Round One**, the AI was asked simply to *"make a user settings page"*. The resulting script checked only if the fields were non-empty. This created severe edge cases:
- Invalid email formats (e.g., `invalidemail`) were accepted.
- Passwords of length 1 were marked as "saved successfully".
- Special characters in usernames went unchecked.

In **Round Two**, with precise constraints, the form implements strict regex matching for emails, uppercase/number checks for passwords, and length validation. 

### 2. Accessibility
Round One lacked semantic elements. In Round Two, inputs contain explicit autocomplete attributes (`username`, `email`, `new-password`), `aria-required="true"`, and connect errors dynamically to inputs using `aria-describedby` and `role="alert"`. This ensures visually impaired users are instantly notified of errors.

### 3. Review Effort & AI Mistakes Caught
In **Round One**, the AI coupled the validation logic directly into the form's submit event listener inside `app.js`. This makes it impossible to unit-test validation functions without bootstrapping JSDOM. 
During **Round Two**, we specifically requested isolating validation rules into a clean utility module (`validation.js`), allowing us to write a dedicated validation test suite.

Additionally, in Round One, the AI forgot to use `novalidate` on the form element, causing browser default validation tooltips to conflict with the custom alert popups. In Round Two, this was resolved by using custom error spans and `novalidate`.

---

## Conclusion
While Round One felt faster initially, it produced a fragile UI that would require massive manual code refactoring during a pull request review. Round Two, through structured planning and verification, produced production-grade, testable code with minimal review overhead.
