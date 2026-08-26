'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

// Vertex shader - simple pass-through
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader - weather aurora gradient with mouse interaction
const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  varying vec2 vUv;

  // Noise function for organic movement
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // Smooth noise interpolation
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Fractal Brownian Motion for layered noise
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * smoothNoise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    // Normalize coordinates and correct aspect ratio
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    // Mouse influence - creates gentle flow toward cursor
    vec2 mouse = u_mouse / u_resolution;
    mouse.x *= u_resolution.x / u_resolution.y;
    vec2 mouseInfluence = (mouse - st) * 0.3;
    
    // Time-based animation with mouse influence
    float time = u_time * 0.2;
    vec2 pos = st + mouseInfluence;
    
    // Create flowing aurora layers
    float n1 = fbm(pos * 2.0 + time);
    float n2 = fbm(pos * 3.0 - time * 0.5);
    float n3 = fbm(pos * 1.5 + time * 0.3);
    
    // Combine noise layers
    float combined = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
    
    // Weather-inspired color palette (blues, purples, soft whites)
    vec3 color1 = vec3(0.1, 0.3, 0.6);  // Deep blue
    vec3 color2 = vec3(0.4, 0.2, 0.6);  // Purple
    vec3 color3 = vec3(0.6, 0.7, 0.9);  // Light blue
    vec3 color4 = vec3(0.9, 0.95, 1.0); // White
    
    // Mix colors based on noise value
    vec3 color = mix(color1, color2, smoothstep(0.0, 0.33, combined));
    color = mix(color, color3, smoothstep(0.33, 0.66, combined));
    color = mix(color, color4, smoothstep(0.66, 1.0, combined));
    
    // Add subtle grain for texture
    float grain = noise(vUv * u_resolution * 0.5 + u_time) * 0.03;
    color += grain;
    
    // Vignette effect for depth
    vec2 center = st - vec2(0.5 * (u_resolution.x / u_resolution.y), 0.5);
    float dist = length(center);
    float vignette = 1.0 - smoothstep(0.3, 0.8, dist);
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: window.innerHeight - e.clientY // Flip Y for WebGL
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.u_time.value = state.clock.elapsedTime;
      material.uniforms.u_resolution.value.set(size.width, size.height);
      material.uniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          u_time: { value: 0 },
          u_resolution: { value: new THREE.Vector2(size.width, size.height) },
          u_mouse: { value: new THREE.Vector2(0, 0) }
        }}
      />
    </mesh>
  );
}

interface ShaderHeroProps {
  children?: React.ReactNode;
}

export function ShaderHero({ children }: ShaderHeroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Pause animation when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Static gradient fallback for reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800" />
        {children && (
          <div className="relative z-10 text-center px-6">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <Canvas
        dpr={[1, 2]} // Cap device pixel ratio for performance
        gl={{ antialias: false }} // Disable antialiasing for performance
        className="absolute inset-0"
      >
        {isVisible && <ShaderPlane />}
      </Canvas>
      {children && (
        <div className="relative z-10 text-center px-6">
          {children}
        </div>
      )}
    </div>
  );
}
