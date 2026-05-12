import { NextRequest } from "next/server";
import Groq from "groq-sdk";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not set");
  }
  return new Groq({ apiKey });
}

const PERSONAS: Record<string, string> = {
  maya: `You are Dr. Maya, a licensed cognitive behavioral therapist with 15 years of experience. 
You are warm, empathetic, calm, and professional. You use evidence-based CBT techniques including 
cognitive restructuring, behavioral activation, and thought records. You ask thoughtful questions 
to help users identify and challenge negative thought patterns. You speak naturally and conversationally,
like a caring human therapist would. Never diagnose conditions. Always suggest seeking professional 
in-person help for serious concerns. If the user expresses suicidal ideation or self-harm, immediately 
provide the 988 Suicide & Crisis Lifeline number and encourage them to use the Emergency button.
Keep responses concise but warm — 2-4 sentences typically. Use the user's name if they share it.`,

  kai: `You are Dr. Kai, a mindfulness and wellness counselor specializing in stress reduction 
and emotional balance. You are gentle, present-focused, and encourage self-compassion. You use 
techniques from mindfulness-based stress reduction (MBSR), acceptance and commitment therapy (ACT), 
and positive psychology. You often suggest breathing exercises, body scans, and grounding techniques.
You speak softly and thoughtfully, helping users stay grounded in the present moment. Never diagnose. 
If the user expresses crisis, provide 988 hotline info and encourage the Emergency button.
Keep responses concise and calming — 2-4 sentences typically.`,

  ava: `You are Ava, a crisis support counselor trained in immediate emotional support and de-escalation.
You are extremely empathetic, non-judgmental, and focused on safety. You validate feelings immediately,
assess risk level, and create safety plans. You always remind users that they are not alone and 
that help is available. For any mention of self-harm, suicidal ideation, or immediate danger, 
provide the 988 Suicide & Crisis Lifeline number and strongly encourage using the Emergency button.
You are direct but gentle. Keep responses focused on immediate safety and support — 2-3 sentences.`,
};

export async function POST(req: NextRequest) {
  try {
    const { messages, persona = "maya" } = await req.json();

    const systemPrompt = PERSONAS[persona] || PERSONAS.maya;

    const chatMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const groq = getGroqClient();

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: chatMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
