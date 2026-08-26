'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Bot, User, Cloud, AlertCircle, RefreshCw, Square } from 'lucide-react';
import { ToolCallCard } from '@/components/ToolCallCard';
import { MessageSkeleton } from '@/components/MessageSkeleton';
import { WeatherGlobe } from '@/components/WeatherGlobe';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b border-zinc-200 bg-white px-4 sm:px-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
          <Cloud className="text-blue-500" size={20} aria-hidden="true" />
          <span className="text-sm sm:text-base">Weather Assistant</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-6 pb-32 sm:pb-24">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400" role="alert" aria-live="polite">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
                <div className="flex flex-col gap-2">
                  <div className="font-medium">Connection Error</div>
                  <p className="text-xs opacity-90">{error.message}</p>
                  <button 
                    onClick={handleRetry}
                    className="flex items-center gap-1.5 w-fit rounded bg-red-100 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Retry connection"
                  >
                    <RefreshCw size={12} aria-hidden="true" />
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center text-center text-zinc-500">
              <div className="w-full max-w-lg mb-6">
                <WeatherGlobe />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                How can I help you today?
              </h2>
              <p className="mt-2 max-w-sm text-sm sm:text-base">
                Try asking for the weather in a specific city, e.g., "What's the weather like in Tokyo?"
              </p>
              <div className="mt-4 sm:mt-6 flex flex-col gap-2 w-full max-w-xs sm:max-w-md">
                <button 
                  onClick={() => setInput("What's the weather like in Tokyo?")}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Fill input with: What's the weather like in Tokyo?"
                >
                  "What's the weather like in Tokyo?"
                </button>
                <button 
                  onClick={() => setInput("Get weather for New York in celsius")}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Fill input with: Get weather for New York in celsius"
                >
                  "Get weather for New York in celsius"
                </button>
              </div>
              <p className="mt-4 text-xs">
                (To test the error state, include "error" in the location)
              </p>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} className="flex flex-col gap-2" aria-live={m.role === 'assistant' ? 'polite' : 'off'}>
              <div className={`flex items-center gap-2 text-sm font-medium ${m.role === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                {m.role === 'user' ? <User size={16} aria-hidden="true" /> : <Bot size={16} aria-hidden="true" />}
                <span>{m.role === 'user' ? 'You' : 'Assistant'}</span>
              </div>
              
              {m.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <div key={index} className="whitespace-pre-wrap pl-6 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base">
                      {part.text}
                    </div>
                  );
                }
                if (part.type === 'tool-invocation') {
                  return (
                    <div key={index} className="pl-6">
                      <ToolCallCard toolInvocation={part} />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}

          {status === 'streaming' && <MessageSkeleton />}
        </div>
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 border-t border-zinc-200 bg-white/80 p-3 sm:p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto max-w-2xl">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-within:border-blue-500"
            role="search"
          >
            <label htmlFor="chat-input" className="sr-only">Ask about the weather</label>
            <input
              id="chat-input"
              className="w-full bg-transparent py-2.5 sm:py-3 pl-4 pr-12 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-400"
              value={input}
              placeholder="Ask about the weather..."
              onChange={e => setInput(e.target.value)}
              disabled={status !== 'ready'}
              autoComplete="off"
              aria-label="Ask about the weather"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Send message"
            >
              <Send size={16} aria-hidden="true" />
            </button>
            {status === 'streaming' && (
              <button
                type="button"
                onClick={() => stop()}
                className="absolute right-12 h-8 w-8 flex items-center justify-center rounded-lg bg-red-500 text-white transition-colors hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Stop generation"
              >
                <Square size={16} aria-hidden="true" />
              </button>
            )}
          </form>
          <div className="mt-2 text-center text-xs text-zinc-600 dark:text-zinc-400">
            AI can make mistakes. Verify important information.
          </div>
        </div>
      </footer>
    </div>
  );
}
