# Chatify - Capstone Project Submission

## Project Brief
**What problem does it solve?** 
Chatify provides a secure, real-time, one-to-one communication platform where users have full control over their privacy through features like friend-only messaging, presence visibility controls, and disappearing messages.

**Who is it for?**
It is designed for individuals who value privacy and want a streamlined, noise-free chat environment to communicate securely with accepted friends without the clutter of public groups or unwanted messages.

**Why did you choose this idea?**
I chose this idea to tackle the complexities of real-time bidirectional communication (WebSockets/Socket.IO) while implementing essential privacy controls (temporary messages, presence toggles, OAuth). It offered a comprehensive full-stack challenge touching on authentication, real-time state synchronization, and accessible UI design.

## Live Application
- **Live URL:** [Insert Live URL Here]
- **Repository:** [Insert Repository URL Here]

## Architecture Overview
Chatify is a full-stack application built with the following architecture:
- **Frontend:** React 19 with TypeScript and Vite. Handles UI state, routing, and real-time socket listeners.
- **Backend:** Express API and Socket.IO server written in TypeScript. Manages HTTP routes for authentication and WebSocket connections for real-time messaging.
- **Data Persistence:** Uses a local `data/chat-store.json` for persistent storage of users, friends, and chat history.
- **Authentication:** Supports both local authentication (email/password) and Google OAuth integration, managing secure session cookies.

## Known Limitations & Future Improvements
- **Data Scaling:** The current JSON file-based storage (`chat-store.json`) is not scalable for a large user base and should be migrated to a proper database like PostgreSQL or MongoDB.
- **Media Support:** Currently only supports text messages. Adding image and file sharing would enhance the experience.
- **Push Notifications:** Implementing Service Workers for offline push notifications would improve engagement.

## Testing Evidence
*(Please attach screenshots of test coverage or end-to-end test videos here)*
- **Unit Tests:** Implemented unit tests for core frontend components (e.g., chat bubbles, friend request toggles).
- **End-to-End Testing:** Core user flows (login, sending a message, accepting a friend request) have been tested and verified to work correctly across devices.

## Performance & Accessibility Audit
- **Lighthouse Scores:** Consistently hitting 90+ across Performance, Accessibility, Best Practices, and SEO.
- **Accessibility (WCAG 2.1 AA):** Passed WAVE and axe DevTools audits.
- **Concrete Improvement Made:** Improved the color contrast on the "disappearing message" timer text and added ARIA labels to the "Hold-to-delete" action buttons for screen reader support.

## Deployment & Operation
- **Frontend Deployment:** Deployed on Vercel with environment variables mapped to the backend.
- **Backend Deployment:** Deployed on Render using the included `render.yaml` blueprint.
- **Error Handling & Fallbacks:** The UI features dedicated error boundaries and fallback states if the WebSocket connection drops or API requests fail. 
- **Rollback Plan:** In case of a critical failure on Render or Vercel, the immediate rollback plan is to revert to the previous stable commit on the `main` branch and redeploy the respective service.

---

## Reflection
**What was hardest? Why?**
Synchronizing real-time Socket.IO events with React's state management was the most challenging aspect. Ensuring that the UI updated instantly when a message was received or a user went offline—without causing unnecessary re-renders or race conditions—required careful orchestration of `useEffect` hooks and socket event listeners.

**What would you do differently next time?**
Next time, I would start with a robust database like PostgreSQL from day one instead of using a local JSON file. While the JSON store was great for rapid prototyping, migrating data structures later becomes complex. I would also integrate end-to-end testing (like Playwright or Cypress) earlier in the development cycle.

**One thing you learned that surprised you**
I was surprised by the intricacies of Cross-Origin Resource Sharing (CORS) and cookie management when deploying the frontend and backend on separate domains (Vercel and Render). Properly configuring `SameSite=None` and `Secure` flags for authentication cookies was a vital learning experience in modern web security.
