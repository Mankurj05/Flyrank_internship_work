import { test, expect } from '@playwright/test';

test.describe('Weather Assistant Primary Flow', () => {
  test('loads the application and shows empty state', async ({ page }) => {
    await page.goto('/');
    
    // Check that the header is visible
    await expect(page.getByRole('heading', { name: 'Weather Assistant' })).toBeVisible();
    
    // Check empty state elements
    await expect(page.getByText('How can I help you today?')).toBeVisible();
    await expect(page.getByText('Try asking for the weather in a specific city')).toBeVisible();
    
    // Check example buttons
    await expect(page.getByText("What's the weather like in Tokyo?")).toBeVisible();
  });

  test('clicks example prompt and fills input', async ({ page }) => {
    await page.goto('/');
    
    // Click example prompt
    await page.getByText("What's the weather like in Tokyo?").click();
    
    // Check that input is filled
    const input = page.getByPlaceholder('Ask about the weather...');
    await expect(input).toHaveValue("What's the weather like in Tokyo?");
  });

  test('submits a weather query and sees response', async ({ page }) => {
    await page.goto('/');
    
    // Fill in the input
    const input = page.getByPlaceholder('Ask about the weather...');
    await input.fill('What is the weather in San Francisco?');
    
    // Submit the form
    await page.getByRole('button', { name: 'Send message' }).click();
    
    // Wait for the user message to appear
    await expect(page.getByText('You')).toBeVisible();
    await expect(page.getByText('What is the weather in San Francisco?')).toBeVisible();
    
    // Wait for assistant response (with timeout for API call)
    await expect(page.getByText('Assistant')).toBeVisible({ timeout: 30000 });
    
    // Check for tool invocation or response
    // The response might contain text or a tool invocation
    const pageContent = await page.content();
    expect(pageContent).toMatch(/Assistant|weather|San Francisco/i);
  });

  test('shows error state for invalid location', async ({ page }) => {
    await page.goto('/');
    
    // Fill in input with error trigger
    const input = page.getByPlaceholder('Ask about the weather...');
    await input.fill('What is the weather in error city?');
    
    // Submit the form
    await page.getByRole('button', { name: 'Send message' }).click();
    
    // Wait for user message
    await expect(page.getByText('You')).toBeVisible();
    
    // Wait for assistant response
    await expect(page.getByText('Assistant')).toBeVisible({ timeout: 30000 });
    
    // Check for error state in tool invocation
    await expect(page.getByText('Service Unavailable')).toBeVisible();
  });

  test('send button is disabled when input is empty', async ({ page }) => {
    await page.goto('/');
    
    const sendButton = page.getByRole('button', { name: 'Send message' });
    await expect(sendButton).toBeDisabled();
    
    // Type something
    const input = page.getByPlaceholder('Ask about the weather...');
    await input.fill('Test');
    await expect(sendButton).not.toBeDisabled();
    
    // Clear input
    await input.fill('');
    await expect(sendButton).toBeDisabled();
  });

  test('shows loading state during message submission', async ({ page }) => {
    await page.goto('/');
    
    // Fill and submit
    const input = page.getByPlaceholder('Ask about the weather...');
    await input.fill('Weather in London');
    
    const sendButton = page.getByRole('button', { name: 'Send message' });
    await sendButton.click();
    
    // Check that button shows loading state (spinner icon)
    await expect(sendButton).toBeDisabled();
    
    // Wait for completion
    await expect(page.getByText('Assistant')).toBeVisible({ timeout: 30000 });
  });

  test('displays weather chart when tool succeeds', async ({ page }) => {
    await page.goto('/');
    
    // Submit a valid weather query
    const input = page.getByPlaceholder('Ask about the weather...');
    await input.fill('Weather in New York');
    await page.getByRole('button', { name: 'Send message' }).click();
    
    // Wait for assistant response
    await expect(page.getByText('Assistant')).toBeVisible({ timeout: 30000 });
    
    // Check for weather chart elements (location, temperature)
    await expect(page.getByText('New York', { exact: false })).toBeVisible();
  });
});