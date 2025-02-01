import React from "react";
import Editor, { type Monaco } from '@monaco-editor/react';
import { Box } from "@mantine/core";


interface EditorComponentProps {
    content: string;
    language: string;
    onContentChange: (value: string | undefined) => void;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ content, language, onContentChange }) => {

    const handleEditorWillMount = (monaco: Monaco) => {
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monaco.languages.typescript.JsxEmit.React, // Enable JSX support
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            allowJs: true,
            allowSyntheticDefaultImports: true,
            moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monaco.languages.typescript.ModuleKind.ESNext,
            typeRoots: ["node_modules/@types"],
            baseUrl: "./",
        });

        // Load React typings
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
            `
            declare module "react" {
                function createElement(...args: any[]): any;
            }
            `,
            "file:///node_modules/@types/react/index.d.ts"
        );
    };


    return (
        <Box flex={1} >
            <Editor
                height="100vh"
                language={language}
                value={content}
                beforeMount={handleEditorWillMount}
                onChange={onContentChange}
                theme="vs-dark"
            />
        </Box>
    );
};

export default EditorComponent;
