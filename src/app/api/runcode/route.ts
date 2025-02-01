import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { language, code } = body;

        if (!language || !code) {
            return NextResponse.json({ error: "Language and code are required", success: false }, { status: 400 });
        }

        // Define language mappings for Piston API
        const languageMap: { [key: string]: string } = {
            javascript: "javascript",
            typescript: "typescript",
            python: "python",
            cpp: "cpp",
            c: "c",
            java: "java",
            go: "go",
            rust: "rust",
            csharp: "csharp",
            swift: "swift",
            ruby: "ruby",
            php: "php",
            kotlin: "kotlin"
        };

        const pistonLang = languageMap[language.toLowerCase()];
        if (!pistonLang) {
            return NextResponse.json({ error: "Unsupported language", success: false }, { status: 400 });
        }

        // Call Piston API
        const pistonResponse = await fetch("https://emkc.org/api/v2/piston/runtimes");
        const runtimes = await pistonResponse.json();

        // Get latest available version for the selected language
        const selectedRuntime = runtimes.find((rt: { language: string }) => rt.language === pistonLang);
        if (!selectedRuntime) {
            return NextResponse.json({ error: "Unsupported language or runtime", success: false }, { status: 400 });
        }

        const pistonExecuteResponse = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: selectedRuntime.language,
                version: selectedRuntime.version, // Get the latest available version dynamically
                files: [{ name: `main.${language}`, content: code }]
            })
        });

        const result = await pistonExecuteResponse.json();


        return NextResponse.json(
            {
                output: {
                    stdout: result.run?.stdout.replace(/\n$/, "") || "",
                    stderr: result.run?.stderr.replace(/\n$/, "") || "",
                },
                success: true
            },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
        return NextResponse.json({ error: errorMessage, success: false }, { status: 500 });
    }
}
