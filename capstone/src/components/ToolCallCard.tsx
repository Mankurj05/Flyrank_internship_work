'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UIToolInvocation } from 'ai';
import { AlertCircle, Loader2, CloudRain } from 'lucide-react';
import { WeatherForecastChart } from './WeatherForecastChart';

interface ToolCallCardProps {
  toolInvocation: any;
}

export function ToolCallCard({ toolInvocation }: ToolCallCardProps) {
  // State machine derivation for AI SDK v7
  const isStreaming = toolInvocation.state === 'partial-call';
  const isExecuting = toolInvocation.state === 'call';
  const hasResult = toolInvocation.state === 'result';
  const hasError = toolInvocation.state === 'result' && 
                   toolInvocation.result && 
                   typeof toolInvocation.result === 'object' && 
                   'error' in toolInvocation.result;

  // We determine the active state for AnimatePresence
  type ToolState = 'streaming' | 'executing' | 'error' | 'success';
  let currentState: ToolState = 'streaming';
  
  if (hasError) {
    currentState = 'error';
  } else if (hasResult) {
    currentState = 'success';
  } else if (isExecuting) {
    currentState = 'executing';
  }

  // Motion variants for crossfade
  const variants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="my-4 w-full max-w-md">
      <AnimatePresence mode="wait">
        {currentState === 'streaming' && (
          <motion.div
            key="streaming"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
          >
            <Loader2 className="animate-spin text-zinc-400" size={16} aria-hidden="true" />
            <div className="flex flex-col">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Generating parameters...</span>
              <span className="text-xs">Preparing to call weather service</span>
            </div>
          </motion.div>
        )}

        {currentState === 'executing' && (
          <motion.div
            key="executing"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400"
          >
            <CloudRain className="animate-pulse" size={18} aria-hidden="true" />
            <div className="flex flex-col">
              <span className="font-medium">Fetching weather data...</span>
              <span className="text-xs opacity-80">
                Location: {toolInvocation.args?.location || 'Unknown'}
              </span>
            </div>
          </motion.div>
        )}

        {currentState === 'error' && (
          <motion.div
            key="error"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <span className="font-medium">Service Unavailable</span>
              <span className="text-xs opacity-90">
                {typeof toolInvocation.result === 'object' && 'error' in toolInvocation.result 
                  ? toolInvocation.result.error 
                  : 'An error occurred'}
              </span>
              <button 
                className="mt-2 w-fit rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => alert("Retry functionality would trigger here")}
                aria-label="Retry weather request"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {currentState === 'success' && (
          <motion.div
            key="success"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {toolInvocation.toolName === 'getWeatherAndForecast' && 
             toolInvocation.result && 
             typeof toolInvocation.result === 'object' && 
             !('error' in toolInvocation.result) && (
              <WeatherForecastChart data={toolInvocation.result} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
