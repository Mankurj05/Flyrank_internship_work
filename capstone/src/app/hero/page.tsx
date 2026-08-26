'use client';

import { ShaderHero } from '@/components/ShaderHero';

export default function HeroPage() {
  return (
    <ShaderHero>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          Weather Assistant
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-8 drop-shadow-md max-w-2xl mx-auto">
          AI-powered weather intelligence with interactive 3D visualization
        </p>
        <a 
          href="/" 
          className="inline-block px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 drop-shadow-md"
        >
          Try the App
        </a>
      </div>
    </ShaderHero>
  );
}
