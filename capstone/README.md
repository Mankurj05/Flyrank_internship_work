# Weather Assistant AI

A modern AI-powered weather assistant built with Next.js 16, the AI SDK v7, and React Three Fiber. Features interactive 3D visualization, custom GLSL shader hero, streaming AI responses, and comprehensive accessibility support.

![Weather Assistant](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![AI SDK](https://img.shields.io/badge/AI%20SDK-v7-purple?style=flat-square)

## Features

- **AI-Powered Weather Queries**: Natural language weather requests with streaming responses
- **Interactive 3D Globe**: React Three Fiber globe with color, wireframe, and rotation controls
- **Custom Shader Hero**: GLSL fragment shader with mouse interaction and aurora gradients
- **Real-time Tool Streaming**: Visual states for tool lifecycle (streaming, executing, success, error)
- **Accessibility First**: ARIA labels, keyboard navigation, reduced motion support, screen reader friendly
- **Mobile Responsive**: Touch-friendly controls, 100dvh fix for mobile Safari
- **Production Ready**: Rate limiting, input validation, error handling

## Screenshots

### Main Application
- Interactive chat interface with AI assistant
- 3D weather globe in empty state
- Tool invocation cards with animated states
- Weather forecast charts

### Shader Hero
- Fullscreen aurora gradient shader
- Mouse-responsive flow field
- High-contrast text overlay

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- OpenAI API key (for production use)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd capstone
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
# Create .env.local file
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o | Yes (production) | - |
| `NODE_ENV` | Environment (development/production) | No | development |

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16 with App Router
- **AI**: AI SDK v7 (Vercel) with OpenAI GPT-4o
- **3D**: React Three Fiber, Three.js, @react-three/drei
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Validation**: Zod
- **Testing**: Vitest, Playwright

### Project Structure

```
capstone/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts    # AI chat endpoint with tool streaming
│   │   ├── page.tsx             # Main application
│   │   └── hero/page.tsx        # Shader hero page
│   ├── components/
│   │   ├── WeatherGlobe.tsx      # 3D interactive globe
│   │   ├── ShaderHero.tsx       # GLSL shader component
│   │   ├── ToolCallCard.tsx     # Tool invocation UI
│   │   ├── MessageSkeleton.tsx  # Loading skeleton
│   │   └── WeatherForecastChart.tsx
│   └── test/
│       └── setup.ts             # Test configuration
├── e2e/
│   └── primary-flow.spec.ts     # Playwright E2E tests
└── vitest.config.ts             # Vitest configuration
```

### Key Components

**AI Chat Route** (`src/app/api/chat/route.ts`)
- Handles streaming AI responses with tool calls
- Rate limiting (20 requests/minute per IP)
- Input validation (max 500 characters)
- Mock weather data for demonstration
- Error handling with proper HTTP status codes

**WeatherGlobe** (`src/components/WeatherGlobe.tsx`)
- Interactive 3D sphere with MeshDistortMaterial
- Color picker, wireframe toggle, auto-rotate controls
- Reduced motion fallback
- Lazy loading with Suspense
- DPR limiting for performance

**ShaderHero** (`src/components/ShaderHero.tsx`)
- Custom GLSL fragment shader
- Uses u_time, u_resolution, u_mouse uniforms
- Fractal Brownian Motion for organic patterns
- Tab visibility API for performance
- Static gradient fallback for reduced motion

## Tool Contract

### `getWeatherAndForecast`

**Description**: Get the current weather and 5-day forecast for a given location

**Schema (Zod)**:
```typescript
{
  location: string,           // City and state/country, e.g. "San Francisco, CA"
  unit?: 'celsius' | 'fahrenheit'  // Temperature unit (default: fahrenheit)
}
```

**Return Shape**:
```typescript
{
  location: string,
  unit: 'celsius' | 'fahrenheit',
  current: {
    temp: number,
    condition: string,
    humidity: number,
    wind: number
  },
  forecast: Array<{
    day: string,
    temp: number,
    condition: string
  }>
}
```

## Tool Lifecycle States

The application renders four distinct visual states for tool execution:

1. **Streaming** - "Generating parameters..." with spinner while AI prepares tool arguments
2. **Executing** - "Fetching weather data..." with location info while tool runs
3. **Success** - Interactive chart component showing weather forecast data
4. **Error** - Designed error state with alert icon, error message, and retry button

## Error Handling

### Implemented Error States

1. **Connection Errors** - Network failures, API errors, timeout issues
   - Display error banner with retry button
   - Uses useChat error object

2. **Tool Execution Errors** - Weather service failures
   - Per-tool error state with try again button
   - Distinct visual treatment from connection errors

3. **Empty States** - First run, no messages
   - Designed onboarding with example prompts
   - Click-to-fill suggestions to guide users

4. **Loading States** - Message skeleton during response
   - Skeleton matches real content layout
   - Prevents layout shift during streaming

### Mobile Safari Optimizations

- Fixed 100vh height issue using `100dvh`
- Overscroll behavior prevention
- Safe area inset handling for keyboard
- Responsive design for all screen sizes

## Testing

### Component Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### All Tests

```bash
npm run test:run
```

## Accessibility

**Lighthouse Scores (Mobile):**
- Performance: 45/100 (3D rendering overhead)
- Accessibility: 89/100 ✅
- Best Practices: 100/100 ✅
- SEO: 100/100 ✅

**Accessibility Features:**
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators on all controls
- `aria-live` regions for AI responses
- Stop button for streaming (keyboard accessible)
- Reduced motion fallbacks
- High contrast text
- Screen reader friendly

See [AUDIT.md](./AUDIT.md) for detailed accessibility audit results.

## Performance

### Optimizations

- DPR limiting to [1, 2] for 3D rendering
- Tab visibility API to pause animations
- Lazy loading with Suspense
- Reduced motion detection
- Code splitting for 3D components
- Static page generation where possible

### Bundle Impact

- React Three Fiber: ~150KB
- Three.js: ~600KB
- AI SDK: ~50KB
- Total bundle: ~1.2MB (gzipped)

## 3D Weather Globe Experience

The application features an interactive 3D weather globe built with React Three Fiber:

- **Interactive 3D Scene**: Distorted sphere with MeshDistortMaterial for dynamic weather effect
- **User Controls**: Color picker, wireframe toggle, and auto-rotate control
- **Performance Optimized**: Lazy-loaded canvas with reduced motion fallback
- **Mobile Responsive**: Touch-friendly orbit controls and responsive sizing
- **Accessibility**: Respects prefers-reduced-motion setting with static fallback

### Performance Notes

- **Bundle Impact**: React Three Fiber adds ~150KB to bundle size
- **Optimizations**: 
  - DPR limiting to [1, 2] for performance
  - Power preference set to high-performance
  - Lazy loading with Suspense
  - Reduced motion detection for accessibility
- **Frame Rate**: Maintains 60fps on modern devices with auto-rotate enabled

### What I'd Add With More Time

- Weather data visualization on the 3D globe (temperature heat map)
- Particle effects for weather conditions (rain, snow, clouds)
- More complex geometry with actual Earth texture
- Integration with real weather API to show live conditions on globe
- Animation transitions between different weather states

## Shader Hero

The `/hero` route features a custom GLSL fragment shader:

- **Theme**: Weather Aurora Gradient
- **Uniforms**: u_time, u_resolution, u_mouse
- **Features**: Mouse-responsive flow field, grain texture, vignette
- **Fallback**: Static gradient for reduced motion users

See [SHADER_DOCUMENTATION.md](./SHADER_DOCUMENTATION.md) for complete shader breakdown.

## Production Deployment

### Environment Setup

1. Set `OPENAI_API_KEY` in Vercel environment variables
2. Deploy via Vercel CLI or GitHub integration

### Rate Limiting

- 20 requests per minute per IP
- 500 character limit per message
- 30 second max duration for streaming

### Security

- Input validation on all endpoints
- Error messages don't expose sensitive information
- CORS configured for production domain

## How AI Tools Built This

This project was built with significant assistance from AI tools (Cascade/Claude):

### AI Contributions

1. **Architecture Design**: AI helped design the component structure and choose appropriate libraries
2. **Shader Development**: The GLSL fragment shader was co-authored with AI, with iterative refinement of the noise functions and color mixing
3. **Accessibility Fixes**: AI identified and fixed accessibility issues (ARIA labels, focus states, contrast)
4. **Test Writing**: Component tests and E2E tests were written with AI assistance
5. **Error Handling**: AI helped design the error state architecture and edge case handling
6. **Documentation**: README and shader documentation were co-written with AI

### Human Decisions

1. **Visual Design**: Color palette, layout decisions, and UX patterns
2. **Feature Scope**: Deciding which features to include (3D globe, shader hero)
3. **Performance Trade-offs**: Accepting 45 performance score for 3D experience
4. **Production Hygiene**: Rate limiting strategy and input validation
5. **Testing Strategy**: Choosing Vitest and Playwright, writing test scenarios

### Iterative Process

The development followed an iterative AI-assisted workflow:
- Initial code generation by AI
- Human review and feedback
- AI refinement based on feedback
- Testing and debugging with AI assistance
- Final polish and optimization

## Testing by Sabotage

Test error states using these keywords in your messages:

- **Network failure:** Include "networkfail" in your message
- **Rate limit:** Include "rate" in your message  
- **Tool error:** Include "error" or "fail" in the location (e.g., "Weather in error city")

### Sabotage Checklist

1. ✅ Kill network before send → Connection error banner
2. ✅ Kill mid-stream → Error state with retry
3. ✅ Return 429 rate limit → Rate limit error message
4. ✅ Tool execution error → Per-tool error UI
5. ✅ Empty conversation → Designed empty state with suggestions

## Future Enhancements

- Real weather API integration (OpenWeatherMap, WeatherAPI)
- User authentication and conversation history
- Multiple weather providers with fallback
- Voice input/output for weather queries
- More sophisticated 3D visualizations
- PWA capabilities for offline use
- Internationalization and localization

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the repository.

## Tool Contract

### `getWeatherAndForecast`

**Description:** Get the current weather and 5-day forecast for a given location

**Schema (Zod):**
```typescript
{
  location: string,           // City and state/country, e.g. "San Francisco, CA"
  unit?: 'celsius' | 'fahrenheit'  // Temperature unit (default: fahrenheit)
}
```

**Return Shape:**
```typescript
{
  location: string,
  unit: 'celsius' | 'fahrenheit',
  current: {
    temp: number,
    condition: string,
    humidity: number,
    wind: number
  },
  forecast: Array<{
    day: string,
    temp: number,
    condition: string
  }>
}
```

**Error Handling:**
- Returns error message if location contains "error" or "fail" (for testing error UI)
- Simulates 2.5s network delay to demonstrate streaming states

## Tool Lifecycle States

The application renders four distinct visual states for tool execution:

1. **Streaming** - "Generating parameters..." with spinner while AI prepares tool arguments
2. **Executing** - "Fetching weather data..." with location info while tool runs
3. **Success** - Interactive chart component showing weather forecast data
4. **Error** - Designed error state with alert icon, error message, and retry button

## Error Handling & Edge Cases

### Implemented Error States

1. **Connection Errors** - Network failures, API errors, timeout issues
   - Display error banner with retry button
   - Uses useChat error object and reload function

2. **Tool Execution Errors** - Weather service failures
   - Per-tool error state with try again button
   - Distinct visual treatment from connection errors

3. **Empty States** - First run, no messages
   - Designed onboarding with example prompts
   - Click-to-fill suggestions to guide users

4. **Loading States** - Message skeleton during response
   - Skeleton matches real content layout
   - Prevents layout shift during streaming

### Mobile Safari Optimizations

- Fixed 100vh height issue using `100dvh`
- Overscroll behavior prevention
- Safe area inset handling for keyboard
- Responsive design for all screen sizes

## Testing by Sabotage

Test error states using these keywords in your messages:

- **Network failure:** Include "networkfail" in your message
- **Rate limit:** Include "rate" in your message  
- **Tool error:** Include "error" or "fail" in the location (e.g., "Weather in error city")

### Sabotage Checklist

1. Kill network before send → Connection error banner
2. Kill mid-stream → Error state with retry
3. Return 429 rate limit → Rate limit error message
4. Tool execution error → Per-tool error UI
5. Empty conversation → Designed empty state with suggestions

## 3D Weather Globe Experience

The application features an interactive 3D weather globe built with React Three Fiber:

- **Interactive 3D Scene**: Distorted sphere with MeshDistortMaterial for a dynamic weather globe effect
- **User Controls**: Color picker, wireframe toggle, and auto-rotate control
- **Performance Optimized**: Lazy-loaded canvas with reduced motion fallback
- **Mobile Responsive**: Touch-friendly orbit controls and responsive sizing
- **Accessibility**: Respects prefers-reduced-motion setting with static fallback

### Performance Notes

- **Bundle Impact**: React Three Fiber adds ~150KB to bundle size
- **Optimizations**: 
  - DPR limiting to [1, 2] for performance
  - Power preference set to high-performance
  - Lazy loading with Suspense
  - Reduced motion detection for accessibility
- **Frame Rate**: Maintains 60fps on modern devices with auto-rotate enabled

### What I'd Add With More Time

- Weather data visualization on the 3D globe (temperature heat map)
- Particle effects for weather conditions (rain, snow, clouds)
- More complex geometry with actual Earth texture
- Integration with real weather API to show live conditions on globe
- Animation transitions between different weather states

## Tech Stack

- Next.js 16 with App Router
- AI SDK v7 (Vercel) for tool streaming
- React Three Fiber for 3D rendering
- @react-three/drei for 3D helpers (OrbitControls, Environment)
- Three.js for WebGL rendering
- Zod for schema validation
- Framer Motion for smooth state transitions
- Recharts for data visualization
- Tailwind CSS for styling
