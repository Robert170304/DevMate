import React from "react";
import Editor from '@monaco-editor/react';
import { Box } from "@mantine/core";


interface EditorComponentProps {
    content: string;
    language: string;
    onContentChange: (value: string | undefined) => void;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ content, language, onContentChange }) => {
    return (
        <Box flex={1} >
            <Editor
                height="100vh"
                language={language}
                value={content}
                onChange={onContentChange}
                theme="vs-dark"
            />
        </Box>
    );
};

export default EditorComponent;
