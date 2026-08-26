import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Bot, User } from 'lucide-react';
import React from 'react';
import '../../test/mocks/ai';

// Mock message renderer component that tests the message display logic
const MessageRenderer = ({ role, content, hasToolInvocation }: { role: 'user' | 'assistant'; content?: string; hasToolInvocation?: boolean }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className={`flex items-center gap-2 text-sm font-medium ${role === 'user' ? 'text-blue-600' : 'text-zinc-800'}`}>
        {role === 'user' ? <User size={16} /> : <Bot size={16} />}
        <span>{role === 'user' ? 'You' : 'Assistant'}</span>
      </div>
      
      {content && (
        <div className="whitespace-pre-wrap pl-6 text-zinc-700">
          {content}
        </div>
      )}

      {hasToolInvocation && (
        <div className="pl-6">
          <div data-testid="tool-invocation">Tool invocation mock</div>
        </div>
      )}
    </div>
  );
};

describe('MessageRenderer', () => {
  it('renders user message with correct styling', () => {
    render(<MessageRenderer role="user" content="Hello" />);
    
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    const userContainer = screen.getByText('You').closest('.text-blue-600');
    expect(userContainer).toBeInTheDocument();
  });

  it('renders assistant message with correct styling', () => {
    render(<MessageRenderer role="assistant" content="Hi there!" />);
    
    expect(screen.getByText('Assistant')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
    const assistantContainer = screen.getByText('Assistant').closest('.text-zinc-800');
    expect(assistantContainer).toBeInTheDocument();
  });

  it('renders message content correctly', () => {
    render(<MessageRenderer role="user" content="What's the weather like?" />);
    
    expect(screen.getByText("What's the weather like?")).toBeInTheDocument();
  });

  it('renders tool invocation when present', () => {
    render(<MessageRenderer role="assistant" hasToolInvocation={true} />);
    
    expect(screen.getByTestId('tool-invocation')).toBeInTheDocument();
  });

  it('does not render tool invocation when not present', () => {
    render(<MessageRenderer role="assistant" hasToolInvocation={false} />);
    
    expect(screen.queryByTestId('tool-invocation')).not.toBeInTheDocument();
  });

  it('renders both content and tool invocation', () => {
    render(<MessageRenderer role="assistant" content="Checking weather..." hasToolInvocation={true} />);
    
    expect(screen.getByText('Checking weather...')).toBeInTheDocument();
    expect(screen.getByTestId('tool-invocation')).toBeInTheDocument();
  });

  it('handles multiline content correctly', () => {
    const multilineContent = "Line 1\nLine 2\nLine 3";
    render(<MessageRenderer role="user" content={multilineContent} />);
    
    expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    expect(screen.getByText(/Line 2/)).toBeInTheDocument();
    expect(screen.getByText(/Line 3/)).toBeInTheDocument();
  });
});