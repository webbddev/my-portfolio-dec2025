import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { z } from "zod";
import { searchDocuments } from "@/lib/search";
import { Resend } from "resend";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const getChatTools = (reqLocale: string) => ({
  // tool to search the knowledge base
  searchKnowledgeBase: tool({
    description: "Search the knowledge base for relevant information",
    inputSchema: z.object({
      query: z.string().describe("The search query to find relevant documents"),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 3, 0.5);

        if (results.length === 0) {
          return "No relevant information found in the knowledge base.";
        }

        const formattedResults = results
          .map((r, i) => `[${i + 1}] ${r.content}`)
          .join("\n\n");

        return formattedResults;
      } catch (error) {
        console.error("Search error:", error);
        return "Error searching the knowledge base.";
      }
    },
  }),
  // tool to send the CV to the user via email
  sendCvEmail: tool({
    description:
      "Sends the CV to the user via email using Resend. Only call this AFTER the user has explicitly agreed to receive the CV AND provided a valid email address.",
    inputSchema: z.object({
      email: z
        .string()
        .email()
        .describe("The email address provided by the user to send the CV to"),
      locale: z
        .string()
        .optional()
        .describe(
          "The language locale to use for the email content (e.g., en, ru, ro, bg, lt) based on the user's language",
        ),
    }),
    execute: async ({ email, locale: toolLocale }) => {
      const activeLocale = toolLocale || reqLocale || "en";

      try {
        const t = await getTranslations({
          locale: activeLocale,
          namespace: "email",
        });

        console.log(`Attempting to send CV in [${activeLocale}] to: ${email}`);

        const { data, error } = await resend.emails.send({
          from: "Nikolay Tetradov Portfolio <cv.nikolay@tetradov.uk>",
          to: [email],
          subject: t("subject"),
          html: `
            <div style="font-family: sans-serif; line-height: 1.5;">
              <p>${t("greeting")}</p>
              <p>${t("bodyText")}</p>
              <div style="margin: 20px 0;">
                <a href="https://www.tetradov.uk/Nikolay-Tetradov-CV.pdf"
                   style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                   ${t("buttonText")}
                 </a>
              </div>
              <p>${t("closingText")}</p>
            </div>
          `,
          attachments: [
            {
              filename: "Nikolay-Tetradov-CV.pdf",
              path: "https://www.tetradov.uk/Nikolay-Tetradov-CV.pdf",
            },
          ],
        });

        if (error) {
          console.error("Resend sending error:", error);
          return t("errorMessage", { code: error.name, error: error.message });
        }

        console.log(
          `CV email successfully sent in [${activeLocale}] to ${email}. ID: ${data?.id}`,
        );
        return t("successMessage", { email });
      } catch (error) {
        console.error("Resend exception:", error);
        return `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    },
  }),

  // Tool to book a 30-minute introductory call via Cal.com
  bookIntroCall: tool({
    description:
      "Books a 30-minute introductory chat on Nikolay's Google Meet calendar via Cal.com. Only call this AFTER collecting the attendee's full name, email address, job title/role, desired date/time (ISO 8601), and timezone (IANA format). Never guess or assume the date — always confirm explicitly with the user first.",
    inputSchema: z.object({
      name: z.string().describe("Full name of the attendee"),
      email: z.string().email().describe("Email address of the attendee"),
      title: z.string().describe("Job title or role of the attendee (e.g., Recruiter, Hiring Manager, Tech Lead)"),
      dateTime: z
        .string()
        .describe(
          "The desired date and time in ISO 8601 format, e.g. 2026-05-22T10:00:00. Must be in the attendee's timezone.",
        ),
      timeZone: z
        .string()
        .describe(
          "IANA timezone of the attendee, e.g. Europe/Chisinau, Europe/London",
        ),
      language: z
        .string()
        .optional()
        .describe(
          "Language code for the booking confirmation email (e.g. en, ru, ro)",
        ),
    }),
    execute: async ({ name, email, title, dateTime, timeZone, language }) => {
      const calApiKey = process.env.CAL_API_KEY;
      const eventTypeId = Number(process.env.CAL_EVENT_TYPE_ID);

      if (!calApiKey || !eventTypeId) {
        console.error("Missing CAL_API_KEY or CAL_EVENT_TYPE_ID env vars");
        return "BOOKING_ERROR: Calendar integration is not configured. Please contact Nikolay directly.";
      }

      // Convert local date time to UTC format required by Cal.com API v2
      let startUtc: string;
      try {
        if (dateTime.includes("Z") || /([+-]\d{2}:\d{2})$/.test(dateTime)) {
          startUtc = new Date(dateTime).toISOString();
        } else {
          const match = dateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
          if (!match) {
            throw new Error("Invalid dateTime format. Must be YYYY-MM-DDTHH:MM:SS");
          }
          const [_, year, month, day, hour, minute] = match.map(Number);
          const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
          
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone,
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
          });

          const parts = formatter.formatToParts(utcDate);
          const getPart = (type: string) => Number(parts.find(p => p.type === type)?.value);

          const formattedL = Date.UTC(
            getPart("year"),
            getPart("month") - 1,
            getPart("day"),
            getPart("hour"),
            getPart("minute")
          );

          const offset = formattedL - utcDate.getTime();
          const targetUtcTime = utcDate.getTime() - offset;
          startUtc = new Date(targetUtcTime).toISOString();
        }
      } catch (err) {
        console.error("Error converting dateTime to UTC:", err);
        return "BOOKING_ERROR: Invalid date/time format or timezone provided.";
      }

      try {
        const response = await fetch("https://api.cal.com/v2/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${calApiKey}`,
            "cal-api-version": "2024-08-13",
          },
          body: JSON.stringify({
            eventTypeId,
            start: startUtc,
            attendee: {
              name,
              email,
              timeZone,
              language: language || reqLocale || "en",
            },
            bookingFieldsResponses: {
              title,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Cal.com booking error:", JSON.stringify(data));
          const errorMessage =
            data?.error?.message ||
            data?.message ||
            "The selected time slot may be unavailable.";
          return `BOOKING_ERROR: ${errorMessage}`;
        }

        console.log(
          `Booking created successfully for ${email} at ${dateTime} (UTC: ${startUtc}, TZ: ${timeZone}). Booking ID: ${data?.data?.id || data?.data?.uid}`,
        );
        return `BOOKING_SUCCESS: A 30-minute Google Meet intro call has been booked for ${name} (${email}) on ${dateTime} (${timeZone}). A calendar invite with the meeting link will be sent to ${email}.`;
      } catch (error) {
        console.error("Cal.com booking exception:", error);
        return `BOOKING_ERROR: ${error instanceof Error ? error.message : String(error)}`;
      }
    },
  }),
});

const staticToolsForType = getChatTools("en");
export type ChatTools = InferUITools<typeof staticToolsForType>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const {
      messages,
      model,
      locale = "en",
    }: {
      messages: ChatMessage[];
      model: string;
      locale?: string;
    } = await req.json();

    const activeTools = getChatTools(locale);

    const now = new Date();
    const todayISO = now.toISOString().split("T")[0];
    const currentYear = now.getFullYear();
    const currentTime = now.toLocaleString("en-GB", {
      timeZone: "Europe/Chisinau",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
      tools: activeTools,
      system: `
        You represent Nikolay Tetradov's personal portfolio and you can answer any portfolio-related questions.
        The user's current UI locale/language is: ${locale}. Please prioritize responding in this language.

        CURRENT DATE AND TIME (use this when constructing bookings):
        - Today's date: ${todayISO}
        - Current year: ${currentYear}
        - Current time (UTC+2 Chisinau): ${currentTime}
        - When constructing dateTime for bookIntroCall, ALWAYS use year ${currentYear} unless the user explicitly specifies a different year.
        - Format dateTime strictly as YYYY-MM-DDTHH:MM:00 in ISO 8601.
        - NEVER use past dates. If the user says "tomorrow", calculate from ${todayISO}.

        When users ask questions, search the knowledge base for relevant information. Always search before answering if the question might relate to uploaded documents.
        Base your answers on the search results when available. Give concise answers that correctly answer what the user is asking for. Do not flood them with all the information from the search results.

        <Lead Generation Flow>
          1. During the conversation, proactively offer to send Nikolay Tetradov's CV via email if the user seems like a recruiter or shows strong interest.
          2. If the user agrees, politely ask for their email address.
          3. Once the user provides their email address, immediately use the 'sendCvEmail' tool to send the document.
          4. After the tool executes, confirm to the user that the email has been sent.
        </Lead Generation Flow>

        <Booking Flow>
          1. If the user expresses interest in speaking directly with Nikolay (e.g. wants to interview, schedule a call, discuss an opportunity), offer to book a 30-minute introductory chat via Google Meet.
          2. Collect the following conversationally, ONE piece at a time — do not ask for everything at once:
             - Their full name (if not already known)
             - Their email address (reuse if already collected during CV flow)
             - Their job title or role (e.g. Recruiter, Hiring Manager, Tech Lead)
             - Their preferred date (confirm the full date including day, month, and year ${currentYear})
             - Their preferred time (confirm AM/PM or 24h clearly)
             - Their timezone (infer intelligently: ro/ru/bg locale → Europe/Chisinau; if unclear, ask)
          3. Once all details are collected, repeat them back clearly for confirmation. Include the fully constructed ISO datetime and job title so the user can verify.
          4. Call the 'bookIntroCall' tool ONLY after explicit user confirmation.
          5. If the tool output starts with BOOKING_SUCCESS, inform the user the call is booked and they will receive a Google Meet calendar invite by email.
          6. If the tool output starts with BOOKING_ERROR, apologise, explain the slot may be unavailable, and ask the user to suggest an alternative date or time.
          7. Availability is Mon–Sat, 9:00 AM – 5:00 PM Chisinau time. Politely steer users away from Sundays or times outside this window.
        </Booking Flow>

        Always end your final answers (when not asking for an email or booking details) with a call for action suggesting a job offer to the portfolio owner.
        If asked about marital status or availability for a date, reply that Nikolay's heart is already taken by someone called Vkusnenkaya.`,
      stopWhen: stepCountIs(10),
    });

    return result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true,
    });
  } catch (error) {
    console.error("AI Stream Error:", error);
    return new Response(
      "An unexpected error occurred while processing the AI request.",
      { status: 500 },
    );
  }
}

// BELOW IS REFACTORED VERSION OF THE CODE ABOVE WHERE TOOLS ARE DEFINED IN A SEPARATE FILE NAMED TOOLS.TS

// import { streamText, convertToModelMessages, stepCountIs } from "ai";
// import { getChatTools, type ChatMessage } from "./tools";

// const getSystemPrompt = (locale: string) => `
//     You represent Nikolay Tetradov's personal portfolio and you can answer any portfolio-related questions.
//     The user's current UI locale/language is: ${locale}. Please prioritize responding in this language.

//     When users ask questions, search the knowledge base for relevant information. Always search before answering if the question might relate to uploaded documents.
//     Base your answers on the search results when available. Give concise answers that correctly answer what the user is asking for. Do not flood them with all the information from the search results.

//     LEAD GENERATION FLOW:
//     1. During the conversation, proactively offer to send Nikolay Tetradov's CV via email if the user seems like a recruiter or shows strong interest.
//     2. If the user agrees, politely ask for their email address.
//     3. Once the user provides their email address, immediately use the 'sendCvEmail' tool to send the document.
//     4. After the tool executes, confirm to the user that the email has been sent.

//     Always end your final answers (when not asking for an email) with a call to action suggesting a job offer to the portfolio owner.
//     If asked about marital status or availability for a date, reply that Nikolay's heart is already taken by someone called Vkusnenkaya.
// `;

// export async function POST(req: Request) {
//   try {
//     const {
//       messages,
//       model,
//       locale = "en",
//     }: {
//       messages: ChatMessage[];
//       model: string;
//       locale?: string;
//     } = await req.json();

//     const result = streamText({
//       model,
//       messages: await convertToModelMessages(messages),
//       tools: getChatTools(locale),
//       system: getSystemPrompt(locale),
//       stopWhen: stepCountIs(5),
//     });

//     return result.toUIMessageStreamResponse({
//       sendSources: true,
//       sendReasoning: true,
//     });
//   } catch (error) {
//     console.error("AI Stream Error:", error);
//     return new Response(
//       "An unexpected error occurred while processing the AI request.",
//       { status: 500 },
//     );
//   }
// }
