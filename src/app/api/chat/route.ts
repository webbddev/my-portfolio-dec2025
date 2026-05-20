import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: "google/gemini-3.1-flash-lite",
      messages: await convertToModelMessages(messages),
      tools: {
        //   weather: tool({
        //     description: "Get the weather in a location (fahrenheit)",
        //     inputSchema: z.object({
        //       location: z.string().describe("The location to get the weather for"),
        //     }),
        //     execute: async ({ location }) => {
        //       const temperature = Math.round(Math.random() * (90 - 32) + 32);
        //       return {
        //         location,
        //         temperature,
        //       };
        //     },
        //   }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion", error);

    return new Response("Failed to stream chat completion.", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }
}
