import type { Handler } from '@netlify/functions';

interface GenerateItemsRequest {
  listId: string;
  count?: number;
}

interface GeneratedItem {
  id: string;
  listId: string;
  name: string;
  isComplete: boolean;
}

interface GenerateItemsResponse {
  items: GeneratedItem[];
  count: number;
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

export const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { listId, count = 5 }: GenerateItemsRequest = JSON.parse(
      event.body || '{}'
    );

    if (!listId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'listId is required' }),
      };
    }

    const generatedItems: GeneratedItem[] = [];
    const shuffledItems = [...sampleItems].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(count, shuffledItems.length); i++) {
      generatedItems.push({
        id: generateUUID(),
        listId: listId,
        name: shuffledItems[i],
        isComplete: Math.random() > 0.7, // 30% chance of being complete
      });
    }

    const response: GenerateItemsResponse = {
      items: generatedItems,
      count: generatedItems.length,
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
