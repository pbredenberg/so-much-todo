import type { Handler } from '@netlify/functions';
import OpenAI from 'openai';

interface GenerateItemsRequest {
  listId: string;
  prompt?: string;
  count?: number;
}

interface GeneratedItem {
  id: string;
  listId: string;
  name: string;
  description?: string;
  tags?: string[];
  isComplete: boolean;
  dueDate: string | null;
}

interface GenerateItemsResponse {
  items: GeneratedItem[];
  count: number;
  source: 'ai' | 'sample';
}

const sampleItems = [
  'Buy groceries',
  'Call dentist',
  'Schedule meeting',
  'Review documents',
  'Update resume',
  'Plan vacation',
  'Organize desk',
  'Pay bills',
  'Exercise',
  'Read book',
];

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Content filtering for prompts
function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: 'Prompt cannot be empty' };
  }

  if (prompt.length > 255) {
    return { isValid: false, error: 'Prompt must be 255 characters or less' };
  }

  return { isValid: true };
}

// Initialize OpenAI client
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPEN_AI_API_KEY;
  if (!apiKey) {
    console.error('OPEN_AI_API_KEY environment variable not set');
    return null;
  }
  return new OpenAI({ apiKey });
}

// Generate items using OpenAI
async function generateItemsWithAI(
  prompt: string,
  count: number = 5
): Promise<GeneratedItem[]> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error('OpenAI client not available');
  }

  const systemPrompt = `You are a helpful assistant that generates todo list items based on user prompts. 
Generate ${count} relevant, actionable todo items.
For each item, provide:
- name: A clear, concise task name (max 50 characters)
- description: A brief description of the task (max 100 characters)
- tags: 1-3 relevant tags as an array of strings

Respond with valid JSON in this exact format:
{
  "items": [
    {
      "name": "Task name",
      "description": "Task description",
      "tags": ["tag1", "tag2"]
    }
  ]
}

Make the items practical, specific, and actionable. Avoid inappropriate, harmful, or offensive content.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseContent);
    const aiItems = parsedResponse.items;

    if (!Array.isArray(aiItems)) {
      throw new Error('Invalid response format from OpenAI');
    }

    return aiItems.map((item: any) => ({
      id: generateUUID(),
      listId: '', // Will be set by caller
      name: item.name || 'Untitled Task',
      description: item.description || '',
      tags: Array.isArray(item.tags) ? item.tags : [],
      isComplete: false,
      dueDate: null,
    }));
  } catch (error) {
    console.error('Error generating items with AI:', error);
    throw error;
  }
}

export const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { listId, prompt, count = 5 }: GenerateItemsRequest = JSON.parse(
      event.body || '{}'
    );

    if (!listId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'listId is required' }),
      };
    }

    let generatedItems: GeneratedItem[] = [];
    let source: 'ai' | 'sample' = 'sample';

    // If prompt is provided, try AI generation
    if (prompt && prompt.trim()) {
      // Validate prompt
      const validation = validatePrompt(prompt);
      if (!validation.isValid) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: validation.error }),
        };
      }

      try {
        // Try AI generation
        const aiItems = await generateItemsWithAI(prompt, count);
        generatedItems = aiItems.map(item => ({
          ...item,
          listId: listId,
        }));
        source = 'ai';
      } catch (aiError) {
        console.error('AI generation failed, falling back to sample items:', aiError);
        // Fall back to sample items if AI fails
        generatedItems = generateSampleItems(listId, count);
        source = 'sample';
      }
    } else {
      // Generate sample items
      generatedItems = generateSampleItems(listId, count);
      source = 'sample';
    }

    const response: GenerateItemsResponse = {
      items: generatedItems,
      count: generatedItems.length,
      source,
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Helper function to generate sample items
function generateSampleItems(listId: string, count: number): GeneratedItem[] {
  const shuffledItems = [...sampleItems].sort(() => Math.random() - 0.5);
  const items: GeneratedItem[] = [];

  for (let i = 0; i < Math.min(count, shuffledItems.length); i++) {
    // Generate a random due date between 1-30 days from now
    const daysFromNow = Math.floor(Math.random() * 30) + 1;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysFromNow);

    items.push({
      id: generateUUID(),
      listId: listId,
      name: shuffledItems[i],
      description: `Sample task: ${shuffledItems[i]}`,
      tags: ['sample'],
      isComplete: Math.random() > 0.7, // 30% chance of being complete
      dueDate: dueDate.toISOString().split('T')[0], // ISO date format (YYYY-MM-DD)
    });
  }

  return items;
}
