import { exec } from "child_process";
import { NextResponse } from "next/server";
import { writeFileSync, unlinkSync } from "fs";


function getCommand(language: string, code: string): string {
    const languageLowerCased = language.toLowerCase()
    const tempFiles: { [key: string]: string } = {
        javascript: "temp.js",
        typescript: "temp.ts",
        python: "temp.py",
        cpp: "temp.cpp",
        c: "temp.c",
        java: "Temp.java",
        go: "temp.go",
        rust: "temp.rs",
        csharp: "temp.csx",
        swift: "temp.swift",
        ruby: "temp.rb",
        php: "temp.php",
        kotlin: "temp.kt"
    };
    if (tempFiles[languageLowerCased]) {
        writeFileSync(tempFiles[languageLowerCased], code);
    }
    switch (languageLowerCased) {
        case "javascript":
            return `node temp.js`;
        case "typescript":
            return `npx ts-node temp.ts`;
        case "python":
            return `python3 temp.py`;
        case "cpp":
            return `g++ temp.cpp -o temp && ./temp`;
        case "c":
            return `gcc temp.c -o temp && ./temp`;
        case "java":
            return `javac Temp.java && java Temp`;
        case "go":
            // not working
            return `go run temp.go`;
        case "rust":
            return `rustc temp.rs -o temp && ./temp`;
        case "csharp":
            // not working
            return `dotnet script temp.csx`;
        case "swift":
            return `swift temp.swift`;
        case "ruby":
            return `ruby temp.rb`;
        case "php":
            return `php temp.php`;
        case "kotlin":
            return `kotlinc temp.kt -include-runtime -d temp.jar && java -jar temp.jar`;
        default:
            return "";
    }
}


function executeCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                // Include both error message and stderr for better debugging
                const errorDetails = stderr || err.message;
                return resolve({ stdout, stderr: errorDetails }); // Return errors gracefully
            }
            resolve({ stdout, stderr });
        });
    });
}

export async function POST(req: Request) {
    const tempFiles = [
        "temp.js", "temp.ts", "temp.py", "temp.cpp", "temp.c", "Temp.java",
        "temp.go", "temp.rs", "temp.csx", "temp.swift", "temp.rb", "temp.php", "temp.kt", "temp.jar"
    ];
    try {
        const body = await req.json();

        const { language, code } = body;

        // Validate input
        if (!language) {
            return NextResponse.json({ error: "Language and code are required", success: false }, { status: 400 });
        }

        // Define the command based on language
        const command = getCommand(language, code);


        if (!command) {
            return NextResponse.json({ output: { stdout: "", stderr: "Access denied (unsupported code)" }, success: true }, { status: 400 });
        }
        // Execute the command
        const { stdout, stderr } = await executeCommand(command);

        return NextResponse.json(
            { output: { stdout: stdout.trim(), stderr: stderr.trim() }, success: true },
            { status: 200 }
        );
    } catch (error) {
        // Catch any runtime or exec errors
        const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";
        return NextResponse.json({ error: errorMessage, success: false }, { status: 500 });
    } finally {
        // Clean up temporary files
        tempFiles.forEach((file) => {
            try { unlinkSync(file); } catch { }
        });
    }
}
