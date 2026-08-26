import { vi } from 'vitest';

// Mock the AI SDK for testing
export const mockUseChat = vi.fn(() => ({
  messages: [],
  sendMessage: vi.fn(),
  status: 'ready' as const,
  error: null,
  reload: vi.fn(),
}));

export const mockDefaultChatTransport = vi.fn();

export const mockConvertToModelMessages = vi.fn(async (messages) => messages);
export const mockCreateUIMessageStreamResponse = vi.fn();
export const mockToUIMessageStream = vi.fn();
export const mockStreamText = vi.fn();

// Apply the mocks
vi.mock('@ai-sdk/react', () => ({
  useChat: mockUseChat,
  DefaultChatTransport: mockDefaultChatTransport,
}));

vi.mock('ai', () => ({
  convertToModelMessages: mockConvertToModelMessages,
  createUIMessageStreamResponse: mockCreateUIMessageStreamResponse,
  toUIMessageStream: mockToUIMessageStream,
  streamText: mockStreamText,
}));