import React, { useEffect, useRef, useState } from "react";
import Editor, { useMonaco, type Monaco } from '@monaco-editor/react';
import type { editor as EditorType } from 'monaco-editor';
import { Box, Dialog, TextInput } from "@mantine/core";
import { apiHelper } from "@devmate/app/helpers/apiHelper";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import appActions from "@devmate/store/app/actions";
import type { RootState } from "@devmate/store/store";

const { setIsAIChatBox, setIsTerminalOpen } = appActions
interface EditorComponentProps {
    content: string | undefined;
    language: string;
    onContentChange: (value: string) => void;
}

const EditorComponent: React.FC<EditorComponentProps> = ({ content, language, onContentChange }) => {
    const AIChatBox = useSelector((state: RootState) => state.app.isAIChatBoxOpen);
    const [aiChatBoxData, setAiChatBoxData] = useState<AIChatBoxDTO>({
        open: false, messages: [], isExplainCode: false, explainCodeContent: "", isModifyCode: false, modifyCodeContent: ""
    })
    const dispatch = useDispatch()
    const monaco = useMonaco();
    const editorRef = useRef<EditorType.IStandaloneCodeEditor | null>(null);
    const explainCodeActionRegisteredRef = useRef(false); // Track whether the action has been registered
    const modifyCodeActionRegisteredRef = useRef(false); // Track whether the action has been registered
    const [modifyDialogData, setModifyDialogData] = useState({
        open: false,
        selectedCode: "",
        userInstruction: "",
    });


    useEffect(() => {
        if (!monaco) return;

        const fetchSuggestions = debounce(async (model, position) => {
            const text = model.getValue();
            const cursorPosition = model.getOffsetAt(position);
            const inputCode = text.slice(0, cursorPosition);

            const response = (await apiHelper("/api/ai-autocomplete", "POST", {
                code: inputCode,
                language,
            })) as AIAutoCompleteResponse;

            if (response?.suggestions && editorRef.current) {
                const suggestions = response.suggestions.map((line) => ({
                    label: line,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: line,
                    range: {
                        startLineNumber: position.lineNumber,
                        startColumn: model.getWordUntilPosition(position).startColumn,
                        endLineNumber: position.lineNumber,
                        endColumn: model.getWordUntilPosition(position).endColumn,
                    },
                }));

                // Force Monaco to update suggestions instantly
                editorRef.current.trigger("keyboard", "editor.action.triggerSuggest", {});
                return { suggestions };
            }
        }, 500); // Debounce API calls to prevent spamming

        monaco.languages.registerCompletionItemProvider(language, {
            triggerCharacters: [".", " ", "(", ")", "{", "}", ":"],
            provideCompletionItems: async (model, position) => fetchSuggestions(model, position),
        });

        if (!explainCodeActionRegisteredRef.current) {
            // Add the "Explain This Code" action to the context menu
            monaco.editor.addEditorAction({
                id: "explain-code",
                label: "Explain This Code",
                contextMenuGroupId: "navigation",
                contextMenuOrder: 1.5,
                run: async (editor) => {
                    const selection = editor.getSelection();
                    if (!selection) return;

                    const model = editor.getModel();
                    const selectedCode = model?.getValueInRange(selection) ?? "";

                    if (!selectedCode.trim()) return;
                    dispatch(setIsAIChatBox({
                        ...aiChatBoxData,
                        open: true,
                        isExplainCode: true,
                        explainCodeContent: `Explain the following ${language} code:
                        \n\n\`\`\`${selectedCode}\`\`\`\n\n`,
                    }))
                    dispatch(setIsTerminalOpen(false));
                },
            });
            explainCodeActionRegisteredRef.current = true; // **Mark action as registered**
        }

        if (!modifyCodeActionRegisteredRef.current) {
            monaco.editor.addEditorAction({
                id: "modify-code",
                label: "Modify Code",
                contextMenuGroupId: "navigation",
                contextMenuOrder: 1.6,
                run: async (editor) => {
                    const selection = editor.getSelection();
                    if (!selection) return;

                    const model = editor.getModel();
                    const selectedCode = model?.getValueInRange(selection) ?? "";

                    if (!selectedCode.trim()) return;

                    // Open Modify Code Dialog
                    setModifyDialogData({ ...modifyDialogData, open: true, selectedCode });
                },
            });
            modifyCodeActionRegisteredRef.current = true; // **Prevent duplicate registrations**
        }


    }, [monaco, language]);


    const handleEditorWillMount = (monacoEditorRef: Monaco) => {
        monacoEditorRef.languages.typescript.typescriptDefaults.setCompilerOptions({
            jsx: monacoEditorRef.languages.typescript.JsxEmit.React, // Enable JSX support
            target: monacoEditorRef.languages.typescript.ScriptTarget.ES2020,
            allowJs: true,
            allowSyntheticDefaultImports: true,
            moduleResolution: monacoEditorRef.languages.typescript.ModuleResolutionKind.NodeJs,
            module: monacoEditorRef.languages.typescript.ModuleKind.ESNext,
            typeRoots: ["node_modules/@types"],
            baseUrl: "./",
        });

        // Load React typings
        monacoEditorRef.languages.typescript.typescriptDefaults.addExtraLib(
            `
            declare module "react" {
                function createElement(...args: any[]): any;
            }
            `,
            "file:///node_modules/@types/react/index.d.ts"
        );
    };

    useEffect(() => {
        setAiChatBoxData(AIChatBox)
    }, [AIChatBox])

    const handleModifyCode = async () => {
        const { selectedCode, userInstruction } = modifyDialogData;

        if (!selectedCode || !userInstruction.trim()) return;

        // Close the dialog
        setModifyDialogData({ open: false, selectedCode: "", userInstruction: "" });

        // Open AI Chatbox & Send Request
        dispatch(setIsAIChatBox({
            ...aiChatBoxData,
            open: true,
            isExplainCode: false,
            explainCodeContent: "",
            isModifyCode: true,
            modifyCodeContent: `${userInstruction}:
            \n\n\`\`\`${selectedCode}`,
        }));
    };



    return (
        <Box flex={1} >
            <Editor
                height="100vh"
                language={language}
                value={content}
                beforeMount={handleEditorWillMount}
                onChange={(value) => onContentChange(value ?? "")}
                theme="vs-dark"
                onMount={(editor) => (editorRef.current = editor)}
            />
            <Dialog
                opened={modifyDialogData.open}
                onClose={() => setModifyDialogData({ open: false, selectedCode: "", userInstruction: "" })}
                title="Modify Your Code"
                size="lg"
                radius="md"
                withCloseButton
                position={{ top: 50, left: 320 }}
                keepMounted={false}
                transitionProps={{ transition: "fade-down" }}
            >
                <TextInput
                    w="93%"
                    placeholder="Describe the modification..."
                    value={modifyDialogData.userInstruction}
                    onChange={(e) => setModifyDialogData({ ...modifyDialogData, userInstruction: e.currentTarget.value })}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && modifyDialogData.userInstruction.trim()) {
                            handleModifyCode();
                        }
                    }}
                    autoFocus
                />
            </Dialog>

        </Box>
    );
};

export default EditorComponent;
