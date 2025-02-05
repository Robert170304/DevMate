import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const client = new OpenAI({
            baseURL: process.env["AZURE_OPENAI_ENDPOINT"],
            apiKey: process.env["GITHUB_TOKEN"],
        });

        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort(); // Cancel the request after timeout
        }, 30000); // 30 seconds

        try {
            const response = await client.chat.completions.create(
                {
                    model: "gpt-4o",
                    messages: [
                        {
                            role: "system",
                            content: "You are DevMate AI, an assistant for developers, providing helpful and concise responses."
                        },
                        ...messages,
                    ],
                    temperature: 0.7,
                    max_tokens: 512,
                },
                { signal: controller.signal } // Attach the abort controller
            );

            clearTimeout(timeout); // Clear the timeout if we get a response

            const aiResponse = response.choices[0]?.message?.content?.trim();
            if (!aiResponse) {
                return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
            }

            return NextResponse.json({ response: aiResponse }, { status: 200 });
        } catch (error: unknown) {
            if (error instanceof Error) {
                // Check error message instead of error.name
                if (error.message.includes("aborted")) {
                    console.error("🚀 ~ AI Chat API Timeout: Request took too long");
                    return NextResponse.json({ error: "AI response timed out" }, { status: 408 });
                }
            }
            console.error("🚀 ~ AI Chat API Error:", error);
            return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
        }
    } catch (error) {
        console.error("🚀 ~ AI Chat API Error 2:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
