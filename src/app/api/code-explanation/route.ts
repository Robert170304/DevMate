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
                { role: "system", content: `You are an AI that explains ${language} code in a simple and concise manner.` },
                { role: "user", content: `Explain the following ${language} code:\n\n${code}` },
            ],
            model: "gpt-4o-mini",
            temperature: 0.7,
            max_tokens: 512,
        });

        return NextResponse.json({ explanation: response.choices[0].message.content?.trim() });
    } catch (error) {
        console.log("🚀 ~ Code Explanation Error:", error);
        return NextResponse.json({ error: "Failed to explain code" }, { status: 500 });
    }
}
