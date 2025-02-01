import { NextRequest } from "next/server";
import { spawn } from "child_process";

export async function POST(req: NextRequest) {
    const { command } = await req.json();

    if (!command) {
        return new Response(JSON.stringify({ error: "No command provided" }), { status: 400 });
    }

    const process = spawn(command, { shell: true });

    let output = "";

    process.stdout.on("data", (data) => {
        output += data.toString();
    });

    process.stderr.on("data", (data) => {
        output += data.toString();
    });

    return new Response(JSON.stringify({ output }));
}
