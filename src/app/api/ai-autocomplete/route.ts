import { extractCodeLines } from '@devmate/app/utils/commonFunctions';
import { NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(req: Request) {

  try {
    const { code, language } = await req.json();

    const client = new OpenAI({
      baseURL: process.env["AZURE_OPENAI_ENDPOINT"], // Azure OpenAI endpoint
      apiKey: process.env["GITHUB_TOKEN"]
    });

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a coding assistant that provides concise and relevant code completions without unnecessary comments, explanations, or extra text. Only return valid code snippets."
        },
        {
          role: "user",
          content: `Given the following incomplete ${language} code, suggest only the next few logical lines without additional explanations. Ensure the syntax is valid and aligns with best practices.\n\n${code}`,
        }
      ],
      model: "gpt-4o-mini",
      temperature: 0.5, // Lower temp for more predictable results
      max_tokens: 4256, // Reduce token usage for faster responses
      top_p: 0.9, // Slightly controlled randomness
    });

    const suggestions = extractCodeLines(response.choices[0].message.content?.trim().split("\n") || [""])
    console.log("🚀 ~ POST ~ suggestions:", suggestions)

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error)
    return NextResponse.json({ error: "Failed to fetch AI suggestions" }, { status: 500 });
  }
}