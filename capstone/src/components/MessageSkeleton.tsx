'use client';

import { Bot } from 'lucide-react';

export function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        <Bot size={16} />
        <span>Assistant</span>
      </div>
      
      <div className="pl-6 space-y-2">
        <div className="h-4 bg-zinc-200 rounded w-3/4 dark:bg-zinc-800" />
        <div className="h-4 bg-zinc-200 rounded w-1/2 dark:bg-zinc-800" />
        <div className="h-4 bg-zinc-200 rounded w-2/3 dark:bg-zinc-800" />
      </div>
    </div>
  );
}