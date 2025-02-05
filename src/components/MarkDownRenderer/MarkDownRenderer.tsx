import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeHighlight } from "@mantine/code-highlight";

interface CustomCodeProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode; // Make children optional
}

interface MarkdownRendererProps {
    content: string;
}

const CodeBlock: React.FC<CustomCodeProps> = ({
    inline = false,
    className,
    children = "", // default to empty string if undefined
}) => {
    const match = /language-(\w+)/.exec(className ?? "");

    if (inline) {
        return <code className="bg-gray-200 px-1 rounded">{children}</code>;
    }

    // Convert children to string. If it's an array, join it.
    const code = Array.isArray(children) ? children.join('') : String(children);

    return (
        <CodeHighlight
            language={match?.[1] ?? 'plaintext'}
            code={code.trim()}
        />
    );
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code: CodeBlock,
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
