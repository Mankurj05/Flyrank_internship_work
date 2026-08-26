import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import { 
  convertToModelMessages, 
  createUIMessageStreamResponse, 
  toUIMessageStream 
} from 'ai';

export const maxDuration = 30;

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimit.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Input validation - cap message length
    const lastMessage = messages[messages.length - 1];
    const messageText = lastMessage?.parts?.[0]?.text || '';
    
    if (messageText.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Message too long. Maximum 500 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting by IP (using a simple identifier)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Simulate network failure for testing - check for sabotage keywords
    if (messageText.toLowerCase().includes('networkfail')) {
      throw new Error('Network connection failed. Please check your internet connection.');
    }

    const result = streamText({
      model: openai('gpt-4o'),
      messages: await convertToModelMessages(messages),
      tools: {
        getWeatherAndForecast: {
          description: 'Get the current weather and 5-day forecast for a given location',
          inputSchema: z.object({
            location: z.string().describe('The city and state/country to get weather for, e.g. "San Francisco, CA"'),
            unit: z.enum(['celsius', 'fahrenheit']).describe('The temperature unit to return the data in').optional().default('fahrenheit'),
          }),
          execute: async ({ location, unit }) => {
            // Simulate a network delay of 2.5 seconds to allow UI streaming states to be visible
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            // Simulate tool execution failure for testing
            if (location.toLowerCase().includes('error') || location.toLowerCase().includes('fail')) {
                throw new Error(`Failed to fetch weather data for ${location}. Weather service is currently unavailable.`);
            }

            // Return mock data for the UI
            return {
              location,
              unit,
              current: {
                temp: unit === 'celsius' ? 22 : 72,
                condition: 'Partly Cloudy',
                humidity: 45,
                wind: 8,
              },
              forecast: [
                { day: 'Mon', temp: unit === 'celsius' ? 22 : 72, condition: 'Sunny' },
                { day: 'Tue', temp: unit === 'celsius' ? 24 : 75, condition: 'Sunny' },
                { day: 'Wed', temp: unit === 'celsius' ? 19 : 66, condition: 'Rainy' },
                { day: 'Thu', temp: unit === 'celsius' ? 21 : 70, condition: 'Cloudy' },
                { day: 'Fri', temp: unit === 'celsius' ? 23 : 73, condition: 'Partly Cloudy' },
              ]
            };
          },
        },
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
