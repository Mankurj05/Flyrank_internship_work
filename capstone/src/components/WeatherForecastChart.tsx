'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MapPin, Wind, Droplets } from 'lucide-react';

interface WeatherForecastChartProps {
  data: {
    location: string;
    unit: 'celsius' | 'fahrenheit';
    current: {
      temp: number;
      condition: string;
      humidity: number;
      wind: number;
    };
    forecast: Array<{
      day: string;
      temp: number;
      condition: string;
    }>;
  };
}

export function WeatherForecastChart({ data }: WeatherForecastChartProps) {
  const { location, unit, current, forecast } = data;
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <MapPin size={16} />
            <span className="text-sm font-medium">{location}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {current.temp}{unitSymbol}
            </span>
            <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
              {current.condition}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Droplets size={14} />
            <span>{current.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={14} />
            <span>{current.wind} mph</span>
          </div>
        </div>
      </div>

      <div className="mt-6 h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888' }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#888' }} 
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#000' }}
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
