import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherForecastChart } from '../WeatherForecastChart';
import '../../test/mocks/ai';

describe('WeatherForecastChart', () => {
  const mockData = {
    location: 'San Francisco, CA',
    unit: 'fahrenheit' as const,
    current: {
      temp: 72,
      condition: 'Partly Cloudy',
      humidity: 45,
      wind: 8,
    },
    forecast: [
      { day: 'Mon', temp: 72, condition: 'Sunny' },
      { day: 'Tue', temp: 75, condition: 'Sunny' },
      { day: 'Wed', temp: 66, condition: 'Rainy' },
      { day: 'Thu', temp: 70, condition: 'Cloudy' },
      { day: 'Fri', temp: 73, condition: 'Partly Cloudy' },
    ],
  };

  it('renders the location', () => {
    render(<WeatherForecastChart data={mockData} />);
    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
  });

  it('renders current temperature with correct unit', () => {
    render(<WeatherForecastChart data={mockData} />);
    expect(screen.getByText('72°F')).toBeInTheDocument();
  });

  it('renders current weather condition', () => {
    render(<WeatherForecastChart data={mockData} />);
    expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
  });

  it('renders humidity and wind information', () => {
    render(<WeatherForecastChart data={mockData} />);
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('8 mph')).toBeInTheDocument();
  });

  it('renders celsius unit correctly', () => {
    const celsiusData = { ...mockData, unit: 'celsius' as const, current: { ...mockData.current, temp: 22 } };
    render(<WeatherForecastChart data={celsiusData} />);
    expect(screen.getByText('22°C')).toBeInTheDocument();
  });

  it('renders forecast chart', () => {
    render(<WeatherForecastChart data={mockData} />);
    // The chart should be present (checking for the chart container)
    const chartContainer = document.querySelector('.recharts-responsive-container');
    expect(chartContainer).toBeInTheDocument();
  });
});