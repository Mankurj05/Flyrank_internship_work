# Shader Hero Documentation

## Overview

This document explains the custom GLSL fragment shader used in the Weather Assistant's hero section. The shader creates an interactive aurora-inspired gradient that responds to mouse movement and time.

## Shader Concept

**Theme:** Weather Aurora Gradient
- Flowing, organic movement reminiscent of northern lights
- Weather-inspired color palette (blues, purples, soft whites)
- Mouse interaction creates gentle flow toward cursor
- Subtle grain texture for visual depth
- Vignette effect for focus

## Uniforms Used

The shader uses all three core uniforms:

1. **`u_time`** (float): Drives the animation over time
2. **`u_resolution`** (vec2): Provides screen dimensions for aspect ratio correction
3. **`u_mouse`** (vec2): Mouse position for interactive flow field

## Shader Breakdown

### Vertex Shader
```glsl
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```
**Purpose:** Simple pass-through shader that forwards UV coordinates to the fragment shader. This is standard for fullscreen plane rendering.

### Fragment Shader Sections

#### 1. Noise Functions
```glsl
float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
```
**Purpose:** Generates pseudo-random noise values using a hash function. This creates the organic, non-repeating patterns.

```glsl
float smoothNoise(vec2 st) {
  // Smooth interpolation between noise values
}
```
**Purpose:** Smooths the raw noise using cubic interpolation for more natural gradients.

```glsl
float fbm(vec2 st) {
  // Fractal Brownian Motion - layered noise
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * smoothNoise(st);
    st *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
```
**Purpose:** Creates complex, detailed patterns by layering noise at different frequencies and amplitudes. This is what gives the aurora its flowing, cloud-like appearance.

#### 2. Coordinate Setup
```glsl
vec2 st = gl_FragCoord.xy / u_resolution.xy;
st.x *= u_resolution.x / u_resolution.y;
```
**Purpose:** Normalizes pixel coordinates to 0-1 range and corrects aspect ratio so the pattern isn't stretched on wide screens.

#### 3. Mouse Influence
```glsl
vec2 mouse = u_mouse / u_resolution;
mouse.x *= u_resolution.x / u_resolution.y;
vec2 mouseInfluence = (mouse - st) * 0.3;
```
**Purpose:** Calculates the vector from each pixel to the mouse cursor, creating a gentle pull effect that makes the aurora flow toward the cursor.

#### 4. Time-Based Animation
```glsl
float time = u_time * 0.2;
vec2 pos = st + mouseInfluence;
float n1 = fbm(pos * 2.0 + time);
float n2 = fbm(pos * 3.0 - time * 0.5);
float n3 = fbm(pos * 1.5 + time * 0.3);
```
**Purpose:** Generates three separate noise layers moving at different speeds and directions. The `0.2` multiplier on time slows the animation to a calming pace.

#### 5. Color Mixing
```glsl
vec3 color1 = vec3(0.1, 0.3, 0.6);  // Deep blue
vec3 color2 = vec3(0.4, 0.2, 0.6);  // Purple
vec3 color3 = vec3(0.6, 0.7, 0.9);  // Light blue
vec3 color4 = vec3(0.9, 0.95, 1.0); // White

float combined = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
vec3 color = mix(color1, color2, smoothstep(0.0, 0.33, combined));
color = mix(color, color3, smoothstep(0.33, 0.66, combined));
color = mix(color, color4, smoothstep(0.66, 1.0, combined));
```
**Purpose:** Blends the weather-inspired palette based on the combined noise value. The smoothstep function creates smooth transitions between colors.

#### 6. Grain Texture
```glsl
float grain = noise(vUv * u_resolution * 0.5 + u_time) * 0.03;
color += grain;
```
**Purpose:** Adds subtle film grain that animates slowly, giving the shader a more organic, less digital feel.

#### 7. Vignette
```glsl
vec2 center = st - vec2(0.5 * (u_resolution.x / u_resolution.y), 0.5);
float dist = length(center);
float vignette = 1.0 - smoothstep(0.3, 0.8, dist);
color *= vignette;
```
**Purpose:** Darkens the edges of the screen to draw focus to the center and add depth.

## Performance Optimizations

1. **Device Pixel Ratio Cap:** `dpr={[1, 2]}` limits rendering to max 2x pixel density
2. **Antialiasing Disabled:** `antialias: false` for better performance on fullscreen
3. **Tab Visibility:** Animation pauses when tab is hidden using Page Visibility API
4. **Reduced Motion Fallback:** Static gradient for users who prefer reduced motion

## Reduced Motion Fallback

Users with `prefers-reduced-motion: reduce` see a static CSS gradient instead of the animated shader:
```css
bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800
```

This uses the same color palette as the shader for consistency.

## Text Contrast

Text is rendered with:
- White color (`text-white`)
- Drop shadows (`drop-shadow-lg`, `drop-shadow-md`)
- Semi-transparent backgrounds on interactive elements
- High contrast ratio meeting WCAG AA standards

## How to Modify

### Change Colors
Modify the `color1` through `color4` vectors in the fragment shader to use your palette.

### Adjust Speed
Change the `u_time * 0.2` multiplier. Higher values = faster animation.

### Mouse Influence Strength
Adjust the `0.3` in `mouseInfluence = (mouse - st) * 0.3`. Higher = stronger pull.

### Noise Complexity
Change the loop count in `fbm()` (currently 4 iterations). More iterations = more detail, more cost.

## Live URL

The shader hero is available at: `/hero` route on the deployed application

## Technical Notes

- Built with React Three Fiber for WebGL rendering
- Uses custom GLSL shaders (not Three.js materials)
- Fully responsive and aspect-ratio aware
- Works on mobile and desktop
- No external shader libraries - pure GLSL
