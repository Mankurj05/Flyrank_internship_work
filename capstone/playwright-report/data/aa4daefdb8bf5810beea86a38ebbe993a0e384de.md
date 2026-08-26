# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: primary-flow.spec.ts >> Weather Assistant Primary Flow >> submits a weather query and sees response
- Location: e2e\primary-flow.spec.ts:29:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Send message' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]: Weather Assistant
    - main [ref=e8]:
      - generic [ref=e10]:
        - heading "How can I help you today?" [level=2] [ref=e14]
        - paragraph [ref=e15]: Try asking for the weather in a specific city, e.g., "What's the weather like in Tokyo?"
        - generic [ref=e16]:
          - button "\"What's the weather like in Tokyo?\"" [ref=e17]
          - button "\"Get weather for New York in celsius\"" [ref=e18]
        - paragraph [ref=e19]: (To test the error state, include "error" in the location)
    - contentinfo [ref=e20]:
      - generic [ref=e21]:
        - generic [ref=e22]:
          - textbox "Ask about the weather..." [active] [ref=e23]: What is the weather in San Francisco?
          - button [ref=e24]
        - generic [ref=e28]: AI can make mistakes. Verify important information.
  - button "Open Next.js Dev Tools" [ref=e34] [cursor=pointer]
  - alert [ref=e38]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Weather Assistant Primary Flow', () => {
  4   |   test('loads the application and shows empty state', async ({ page }) => {
  5   |     await page.goto('/');
  6   |     
  7   |     // Check that the header is visible
  8   |     await expect(page.getByRole('heading', { name: 'Weather Assistant' })).toBeVisible();
  9   |     
  10  |     // Check empty state elements
  11  |     await expect(page.getByText('How can I help you today?')).toBeVisible();
  12  |     await expect(page.getByText('Try asking for the weather in a specific city')).toBeVisible();
  13  |     
  14  |     // Check example buttons
  15  |     await expect(page.getByText("What's the weather like in Tokyo?")).toBeVisible();
  16  |   });
  17  | 
  18  |   test('clicks example prompt and fills input', async ({ page }) => {
  19  |     await page.goto('/');
  20  |     
  21  |     // Click example prompt
  22  |     await page.getByText("What's the weather like in Tokyo?").click();
  23  |     
  24  |     // Check that input is filled
  25  |     const input = page.getByPlaceholder('Ask about the weather...');
  26  |     await expect(input).toHaveValue("What's the weather like in Tokyo?");
  27  |   });
  28  | 
  29  |   test('submits a weather query and sees response', async ({ page }) => {
  30  |     await page.goto('/');
  31  |     
  32  |     // Fill in the input
  33  |     const input = page.getByPlaceholder('Ask about the weather...');
  34  |     await input.fill('What is the weather in San Francisco?');
  35  |     
  36  |     // Submit the form
> 37  |     await page.getByRole('button', { name: 'Send message' }).click();
      |                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  38  |     
  39  |     // Wait for the user message to appear
  40  |     await expect(page.getByText('You')).toBeVisible();
  41  |     await expect(page.getByText('What is the weather in San Francisco?')).toBeVisible();
  42  |     
  43  |     // Wait for assistant response (with timeout for API call)
  44  |     await expect(page.getByText('Assistant'), { timeout: 30000 }).toBeVisible();
  45  |     
  46  |     // Check for tool invocation or response
  47  |     // The response might contain text or a tool invocation
  48  |     const pageContent = await page.content();
  49  |     expect(pageContent).toMatch(/Assistant|weather|San Francisco/i);
  50  |   });
  51  | 
  52  |   test('shows error state for invalid location', async ({ page }) => {
  53  |     await page.goto('/');
  54  |     
  55  |     // Fill in input with error trigger
  56  |     const input = page.getByPlaceholder('Ask about the weather...');
  57  |     await input.fill('What is the weather in error city?');
  58  |     
  59  |     // Submit the form
  60  |     await page.getByRole('button', { name: 'Send message' }).click();
  61  |     
  62  |     // Wait for user message
  63  |     await expect(page.getByText('You')).toBeVisible();
  64  |     
  65  |     // Wait for assistant response
  66  |     await expect(page.getByText('Assistant'), { timeout: 30000 }).toBeVisible();
  67  |     
  68  |     // Check for error state in tool invocation
  69  |     await expect(page.getByText('Service Unavailable')).toBeVisible({ timeout: 10000 });
  70  |   });
  71  | 
  72  |   test('send button is disabled when input is empty', async ({ page }) => {
  73  |     await page.goto('/');
  74  |     
  75  |     const sendButton = page.getByRole('button', { name: 'Send message' });
  76  |     await expect(sendButton).toBeDisabled();
  77  |     
  78  |     // Type something
  79  |     const input = page.getByPlaceholder('Ask about the weather...');
  80  |     await input.fill('Test');
  81  |     await expect(sendButton).not.toBeDisabled();
  82  |     
  83  |     // Clear input
  84  |     await input.fill('');
  85  |     await expect(sendButton).toBeDisabled();
  86  |   });
  87  | 
  88  |   test('shows loading state during message submission', async ({ page }) => {
  89  |     await page.goto('/');
  90  |     
  91  |     // Fill and submit
  92  |     const input = page.getByPlaceholder('Ask about the weather...');
  93  |     await input.fill('Weather in London');
  94  |     
  95  |     const sendButton = page.getByRole('button', { name: 'Send message' });
  96  |     await sendButton.click();
  97  |     
  98  |     // Check that button shows loading state (spinner icon)
  99  |     await expect(sendButton).toBeDisabled();
  100 |     
  101 |     // Wait for completion
  102 |     await expect(page.getByText('Assistant'), { timeout: 30000 }).toBeVisible();
  103 |   });
  104 | 
  105 |   test('displays weather chart when tool succeeds', async ({ page }) => {
  106 |     await page.goto('/');
  107 |     
  108 |     // Submit a valid weather query
  109 |     const input = page.getByPlaceholder('Ask about the weather...');
  110 |     await input.fill('Weather in New York');
  111 |     await page.getByRole('button', { name: 'Send message' }).click();
  112 |     
  113 |     // Wait for assistant response
  114 |     await expect(page.getByText('Assistant'), { timeout: 30000 }).toBeVisible();
  115 |     
  116 |     // Check for weather chart elements (location, temperature)
  117 |     await expect(page.getByText('New York', { exact: false })).toBeVisible({ timeout: 10000 });
  118 |   });
  119 | });
```