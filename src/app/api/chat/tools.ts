// import { tool, InferUITools, UIDataTypes, UIMessage } from "ai";
// import { z } from "zod";
// import { searchDocuments } from "@/lib/search";
// import { Resend } from "resend";
// import { getTranslations } from "next-intl/server";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const getChatTools = (reqLocale: string) => ({
//   // Tool to search the knowledge base
//   searchKnowledgeBase: tool({
//     description: "Search the knowledge base for relevant information",
//     inputSchema: z.object({
//       query: z.string().describe("The search query to find relevant documents"),
//     }),
//     execute: async ({ query }) => {
//       try {
//         const results = await searchDocuments(query, 3, 0.5);

//         if (results.length === 0) {
//           return "No relevant information found in the knowledge base.";
//         }

//         const formattedResults = results
//           .map((r, i) => `[${i + 1}] ${r.content}`)
//           .join("\n\n");

//         return formattedResults;
//       } catch (error) {
//         console.error("Search error:", error);
//         return "Error searching the knowledge base.";
//       }
//     },
//   }),

//   // Tool to send the CV to the user via email
//   sendCvEmail: tool({
//     description:
//       "Sends the CV to the user via email using Resend. Only call this AFTER the user has explicitly agreed to receive the CV AND provided a valid email address.",
//     inputSchema: z.object({
//       email: z
//         .string()
//         .email()
//         .describe("The email address provided by the user to send the CV to"),
//       locale: z
//         .string()
//         .optional()
//         .describe(
//           "The language locale to use for the email content (e.g., en, ru, ro, bg, lt) based on the user's language",
//         ),
//     }),
//     execute: async ({ email, locale: toolLocale }) => {
//       const activeLocale = toolLocale || reqLocale || "en";

//       try {
//         const t = await getTranslations({
//           locale: activeLocale,
//           namespace: "email",
//         });

//         console.log(`Attempting to send CV in [${activeLocale}] to: ${email}`);

//         const { data, error } = await resend.emails.send({
//           from: "Nikolay Tetradov Portfolio <cv.nikolay@tetradov.uk>",
//           to: [email],
//           subject: t("subject"),
//           html: `
//             <div style="font-family: sans-serif; line-height: 1.5;">
//               <p>${t("greeting")}</p>
//               <p>${t("bodyText")}</p>
//               <div style="margin: 20px 0;">
//                 <a href="https://www.tetradov.uk/Nikolay-Tetradov-CV.pdf"
//                    style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
//                    ${t("buttonText")}
//                  </a>
//               </div>
//               <p>${t("closingText")}</p>
//             </div>
//           `,
//           attachments: [
//             {
//               filename: "Nikolay-Tetradov-CV.pdf",
//               path: "https://www.tetradov.uk/Nikolay-Tetradov-CV.pdf",
//             },
//           ],
//         });

//         if (error) {
//           console.error("Resend sending error:", error);
//           return t("errorMessage", { code: error.name, error: error.message });
//         }

//         console.log(
//           `CV email successfully sent in [${activeLocale}] to ${email}. ID: ${data?.id}`,
//         );
//         return t("successMessage", { email });
//       } catch (error) {
//         console.error("Resend exception:", error);
//         return `Error: ${error instanceof Error ? error.message : String(error)}`;
//       }
//     },
//   }),
// });

// // Types are derived from the tools and exported for use in the UI
// const staticToolsForType = getChatTools("en");
// export type ChatTools = InferUITools<typeof staticToolsForType>;
// export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;