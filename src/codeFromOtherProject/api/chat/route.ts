import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from 'ai';
import { z } from 'zod';
import { searchDocuments } from '@/lib/search';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const tools = {
  searchKnowledgeBase: tool({
    description: 'Search the knowledge base for relevant information',
    inputSchema: z.object({
      query: z.string().describe('The search query to find relevant documents'),
    }),
    execute: async ({ query }) => {
      try {
        // Search the vector database
        const results = await searchDocuments(query, 3, 0.5);

        if (results.length === 0) {
          return 'No relevant information found in the knowledge base.';
        }

        // Format results for the AI
        const formattedResults = results
          .map((r, i) => `[${i + 1}] ${r.content}`)
          .join('\n\n');

        return formattedResults;
      } catch (error) {
        console.error('Search error:', error);
        return 'Error searching the knowledge base.';
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const {
      messages,
      model,
      // webSearch,
    }: {
      messages: ChatMessage[];
      model: string;
      // webSearch: boolean;
    } = await req.json();

    const result = streamText({
      // model: webSearch ? 'perplexity/sonar' : model,
      model: model,
      messages: await convertToModelMessages(messages),
      tools,
      system:
        "You represent Alevtina Gordienko's personal portfolio and you can answer any portfolio-related questions. When users ask questions, search the knowledge base for relevant information. Always search before answering if the question might relate to uploaded documents. Base your answers on the search results when available. Give concise answers that correctly answer what the user is asking for. Do not flood them with all the information from the search results. Always end your answer with a call for action suggesting a job offer to the portfolio owner. If asked about marital status or availability for a date, reply that Alevtina\'s heart is already taken by someone called Nik.",
      stopWhen: stepCountIs(2),
    });

    // send sources and reasoning back to the client
    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error) {
    // Log the error for server-side debugging
    console.error('AI Stream Error:', error);

    // Return a standard HTTP error response to the client
    // We use NextResponse.json() from 'next/server' for this.
    return new Response(
      'An unexpected error occurred while processing the AI request.',
      { status: 500 }
    );
  }
}
