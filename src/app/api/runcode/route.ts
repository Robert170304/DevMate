import { exec } from "child_process";
import { NextResponse } from "next/server";
import { writeFileSync, unlinkSync } from "fs";


function getCommand(language: string, code: string): string {
    const languageLowerCased = language.toLowerCase()
    const tempDir = "/tmp"; // ✅ Use the writable directory
    const tempFiles: { [key: string]: string } = {
        javascript: `${tempDir}/temp.js`,
        typescript: `${tempDir}/temp.ts`,
        python: `${tempDir}/temp.py`,
        cpp: `${tempDir}/temp.cpp`,
        c: `${tempDir}/temp.c`,
        java: `${tempDir}/Temp.java`,
        go: `${tempDir}/temp.go`,
        rust: `${tempDir}/temp.rs`,
        csharp: `${tempDir}/temp.csx`,
        swift: `${tempDir}/temp.swift`,
        ruby: `${tempDir}/temp.rb`,
        php: `${tempDir}/temp.php`,
        kotlin: `${tempDir}/temp.kt`
    };

    if (tempFiles[languageLowerCased]) {
        writeFileSync(tempFiles[languageLowerCased], code);
    }
    switch (languageLowerCased) {
        case "javascript":
            return `node ${tempFiles.javascript}`;
        case "typescript":
            return `npx ts-node ${tempFiles.typescript}`;
        case "python":
            return `python3 ${tempFiles.python}`;
        case "cpp":
            return `g++ ${tempFiles.cpp} -o ${tempDir}/temp && ${tempDir}/temp`;
        case "c":
            return `gcc ${tempFiles.c} -o ${tempDir}/temp && ${tempDir}/temp`;
        case "java":
            return `javac ${tempFiles.java} && java -cp ${tempDir} Temp`;
        case "go":
            // not working
            return `go run ${tempFiles.go}`;
        case "rust":
            return `rustc ${tempFiles.rust} -o ${tempDir}/temp && ${tempDir}/temp`;
        case "csharp":
            // not working
            return `dotnet script ${tempFiles.csharp}`;
        case "swift":
            return `swift ${tempFiles.swift}`;
        case "ruby":
            return `ruby ${tempFiles.ruby}`;
        case "php":
            return `php ${tempFiles.php}`;
        case "kotlin":
            // not working
            return `kotlinc ${tempFiles.kotlin} -include-runtime -d ${tempDir}/temp.jar && java -jar ${tempDir}/temp.jar`;
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
    const tempDir = "/tmp"; // ✅ Ensure cleanup in writable directory
    const tempFiles = [
        `${tempDir}/temp.js`, `${tempDir}/temp.ts`, `${tempDir}/temp.py`,
        `${tempDir}/temp.cpp`, `${tempDir}/temp.c`, `${tempDir}/Temp.java`,
        `${tempDir}/temp.go`, `${tempDir}/temp.rs`, `${tempDir}/temp.csx`,
        `${tempDir}/temp.swift`, `${tempDir}/temp.rb`, `${tempDir}/temp.php`,
        `${tempDir}/temp.kt`, `${tempDir}/temp.jar`, `${tempDir}/temp`
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
