import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolCallCard } from '../ToolCallCard';
import '../../test/mocks/ai';

// Mock the AI SDK ToolInvocation type
const createMockToolInvocation = (state: string, toolName: string = 'getWeatherAndForecast', args?: any, result?: any) => ({
  toolCallId: 'test-call-id',
  toolName,
  state,
  args,
  result,
});

describe('ToolCallCard', () => {
  it('renders streaming state', () => {
    const mockInvocation = createMockToolInvocation('partial-call');
    render(<ToolCallCard toolInvocation={mockInvocation} />);
    
    expect(screen.getByText('Generating parameters...')).toBeInTheDocument();
    expect(screen.getByText('Preparing to call weather service')).toBeInTheDocument();
  });

  it('renders executing state with location', () => {
    const mockInvocation = createMockToolInvocation('call', 'getWeatherAndForecast', { location: 'Tokyo' });
    render(<ToolCallCard toolInvocation={mockInvocation} />);
    
    expect(screen.getByText('Fetching weather data...')).toBeInTheDocument();
    expect(screen.getByText('Location: Tokyo')).toBeInTheDocument();
  });

  it('renders success state with weather chart', () => {
    const mockResult = {
      location: 'San Francisco, CA',
      unit: 'fahrenheit',
      current: { temp: 72, condition: 'Sunny', humidity: 45, wind: 8 },
      forecast: [
        { day: 'Mon', temp: 72, condition: 'Sunny' },
        { day: 'Tue', temp: 75, condition: 'Sunny' },
      ],
    };
    const mockInvocation = createMockToolInvocation('result', 'getWeatherAndForecast', { location: 'San Francisco' }, mockResult);
    render(<ToolCallCard toolInvocation={mockInvocation} />);
    
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByText('72°F')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const mockInvocation = createMockToolInvocation('result', 'getWeatherAndForecast', { location: 'Error City' }, { error: 'Service unavailable' });
    render(<ToolCallCard toolInvocation={mockInvocation} />);
    
    expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Service unavailable')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('handles retry button click in error state', () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    const mockInvocation = createMockToolInvocation('result', 'getWeatherAndForecast', { location: 'Error City' }, { error: 'Service unavailable' });
    render(<ToolCallCard toolInvocation={mockInvocation} />);
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    expect(alertMock).toHaveBeenCalledWith('Retry functionality would trigger here');
    
    alertMock.mockRestore();
  });

  it('does not render chart for unknown tool names', () => {
    const mockResult = { data: 'some data' };
    const mockInvocation = createMockToolInvocation('result', 'unknownTool', {}, mockResult);
    render(<ToolCallCard toolInvocation={mockInvocation} />);
    
    // Should not render the weather chart for unknown tools
    expect(screen.queryByText('San Francisco, CA')).not.toBeInTheDocument();
  });
});