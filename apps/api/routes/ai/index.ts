import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { Elysia } from 'elysia';

export const aiRoutes = new Elysia().get('/', async () => {
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    prompt: "What's the weather like today?",
  });
  return { text };
});
