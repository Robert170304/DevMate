"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import "./CommandPanel.scss";

const CommandPanel = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminal, setTerminal] = useState<Terminal | null>(null);
    console.log("🚀 ~ CommandPanel ~ terminal:", terminal)
    const inputBuffer = useRef<string>(""); // Buffer to store user input
    const prompt = "►► devmate % "; // Define the prompt

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new Terminal();
        term.open(terminalRef.current);
        setTerminal(term);

        term.write(prompt);

        term.onData(async (key) => {
            if (key === "\r") { // Enter key
                const command = inputBuffer.current.trim();
                if (command) {
                    await executeCommand(command, term);
                }
                inputBuffer.current = ""; // Clear buffer
                writePrompt(term)
            } else if (key === "\u007F") { // Backspace
                if (inputBuffer.current.length > 0) {
                    inputBuffer.current = inputBuffer.current.slice(0, -1);
                    term.write("\b \b"); // Remove last character visually
                }
            } else {
                inputBuffer.current += key;
                term.write(key); // Print input character in terminal
            }
        });

        return () => term.dispose();
    }, [terminalRef]);

    const writePrompt = (term: Terminal) => {
        console.log("🚀 ~ writePrompt ~ term:", term)
        term.write("\r\n" + prompt); // No new line, cursor stays in the same line
    };

    const executeCommand = async (command: string, term: Terminal) => {
        try {
            const res = await fetch("/api/terminal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ command }),
            });

            const data = await res.json();
            console.log("🚀 ~ executeCommand ~ data:", data)
            term.write("\r\n" + "robert");
        } catch (error) {
            console.log("🚀 ~ executeCommand ~ error:", error)
            term.write("Error executing command.");
        }
    };

    return <div ref={terminalRef} className="commandPanel_container" />;
};

export default CommandPanel;
