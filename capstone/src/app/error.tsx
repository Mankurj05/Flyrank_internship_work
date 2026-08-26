'use client';

import { useEffect } from 'react';
import { Cloud, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
            <Cloud className="text-red-500" size={32} />
          </div>
        </div>
        
        <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Something went wrong
        </h2>
        
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          We encountered an unexpected error. This has been logged and our team will look into it.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Go to home
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {error.message}
              {error.digest && <span className="block mt-1 text-zinc-500">Digest: {error.digest}</span>}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}