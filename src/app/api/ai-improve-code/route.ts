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
          content: `You are an AI coding assistant that improves ${language} code. Your response should contain ONLY the improved code—NO explanations, NO markdown formatting (such as triple backticks), and NO additional text.`,
        },
        {
          role: "user",
          content: `Improve the following ${language} code. Remove inefficiencies and follow best practices without changing its functionality:\n\n${code}`,
        }
      ],
      model: "gpt-4o",
      temperature: 0.4, // Lower temp for more controlled improvements
      max_tokens: 4096,
      top_p: 0.9, // Controlled randomness
    });

    let improvedCode = response.choices[0].message.content?.trim() ?? "";
    improvedCode = improvedCode.replace(/^```.*\n?/, "").replace(/```$/, "");
    console.log("🚀 ~ POST ~ improvedCode:", improvedCode);

    return NextResponse.json({ improvedCode });
  } catch (error) {
    console.error("🚀 ~ POST ~ error:", error);
    return NextResponse.json({ error: "Failed to improve code" }, { status: 500 });
  }
}
