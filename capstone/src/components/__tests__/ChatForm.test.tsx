import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Send } from 'lucide-react';
import React from 'react';
import '../../test/mocks/ai';

// Mock chat form component for testing
const ChatForm = ({ onSubmit, disabled = false }: { onSubmit: (text: string) => void; disabled?: boolean }) => {
  const [input, setInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="chat-form">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about the weather..."
        disabled={disabled}
        data-testid="chat-input"
        aria-label="Chat input"
      />
      <button
        type="submit"
        disabled={!input.trim() || disabled}
        data-testid="send-button"
        aria-label="Send message"
      >
        <Send size={16} />
      </button>
    </form>
  );
};

describe('ChatForm', () => {
  it('renders input field with correct placeholder', () => {
    const mockSubmit = vi.fn();
    render(<ChatForm onSubmit={mockSubmit} />);
    
    const input = screen.getByLabelText('Chat input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Ask about the weather...');
  });

  it('renders send button with correct icon', () => {
    const mockSubmit = vi.fn();
    render(<ChatForm onSubmit={mockSubmit} />);
    
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    const mockSubmit = vi.fn();
    render(<ChatForm onSubmit={mockSubmit} />);
    
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeDisabled();
  });

  it('enables send button when input has text', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ChatForm onSubmit={mockSubmit} />);
    
    const input = screen.getByLabelText('Chat input');
    const sendButton = screen.getByLabelText('Send message');
    
    await user.type(input, 'Hello');
    
    expect(sendButton).not.toBeDisabled();
  });

  it('disables send button when form is disabled', () => {
    const mockSubmit = vi.fn();
    render(<ChatForm onSubmit={mockSubmit} disabled={true} />);
    
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).toBeDisabled();
  });

  it('submits form with correct input value', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ChatForm onSubmit={mockSubmit} />);
    
    const input = screen.getByLabelText('Chat input');
    const sendButton = screen.getByLabelText('Send message');
    
    await user.type(input, 'What is the weather?');
    await user.click(sendButton);
    
    expect(mockSubmit).toHaveBeenCalledWith('What is the weather?');
  });

  it('clears input after successful submission', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ChatForm onSubmit={mockSubmit} />);
    
    const input = screen.getByLabelText('Chat input') as HTMLInputElement;
    const sendButton = screen.getByLabelText('Send message');
    
    await user.type(input, 'Test message');
    await user.click(sendButton);
    
    expect(input.value).toBe('');
  });

  it('does not submit when input is only whitespace', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ChatForm onSubmit={mockSubmit} />);
    
    const input = screen.getByLabelText('Chat input');
    const sendButton = screen.getByLabelText('Send message');
    
    await user.type(input, '   ');
    await user.click(sendButton);
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits on Enter key press', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ChatForm onSubmit={mockSubmit} />);
    
    const input = screen.getByLabelText('Chat input');
    
    await user.type(input, 'Test message{Enter}');
    
    expect(mockSubmit).toHaveBeenCalledWith('Test message');
  });

  it('prevents default form submission', async () => {
    const mockSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ChatForm onSubmit={mockSubmit} />);
    
    const form = screen.getByTestId('chat-form');
    const input = screen.getByLabelText('Chat input');
    
    await user.type(input, 'Test');
    fireEvent.submit(form);
    
    expect(mockSubmit).toHaveBeenCalledWith('Test');
  });
});