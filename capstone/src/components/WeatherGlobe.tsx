'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';

function Globe({ color, wireframe }: { color: string; wireframe: boolean }) {
  return (
    <Sphere args={[1, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.4}
        metalness={0.6}
        wireframe={wireframe}
      />
    </Sphere>
  );
}

function WeatherGlobeScene({ color, wireframe, autoRotate }: { color: string; wireframe: boolean; autoRotate: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <Globe color={color} wireframe={wireframe} />
      
      <Environment preset="city" />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        minDistance={1.5}
        maxDistance={4}
      />
    </>
  );
}

export function WeatherGlobe() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
        <Cloud className="text-blue-500 animate-pulse" size={48} />
      </div>
    );
  }

  if (prefersReducedMotion) {
    return (
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
        <div className="text-center">
          <Cloud className="text-blue-500 mx-auto mb-2" size={48} />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">3D visualization disabled for reduced motion</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 sm:h-96">
      <Canvas
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true 
        }}
        className="rounded-xl"
      >
        <Suspense fallback={null}>
          <WeatherGlobeScene color={color} wireframe={wireframe} autoRotate={autoRotate} />
        </Suspense>
      </Canvas>
      
      {/* Controls Panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex flex-wrap gap-3 items-center justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <label htmlFor="globe-color" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Color:</label>
            <input
              id="globe-color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0"
              aria-label="Choose globe color"
            />
          </div>
          
          <button
            onClick={() => setWireframe(!wireframe)}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Toggle wireframe mode"
          >
            {wireframe ? 'Solid' : 'Wireframe'}
          </button>
          
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Toggle auto-rotation"
          >
            {autoRotate ? 'Stop' : 'Rotate'}
          </button>
        </div>
      </div>
    </div>
  );
}
