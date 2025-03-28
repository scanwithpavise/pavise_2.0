import { deepseek } from "@ai-sdk/deepseek";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return new Response("Missing OpenRouter API key", { status: 500 });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-distill-qwen-32b:free",
          messages,
        }),
      }
    );

    if (!response.ok) {
      return new Response(`OpenRouter API Error: ${response.statusText}`, {
        status: response.status,
      });
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content || "No response";
    return new Response(messageContent, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
