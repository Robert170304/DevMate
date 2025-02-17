import { ActionIcon, Box, Flex, Image, Tabs, Title, Tooltip } from '@mantine/core';
import classes from "./EditorViewTabs.module.scss"
import EditorComponent from '../EditorComponent/EditorComponent';
import React, { useEffect, useRef, useState } from 'react';
import type { RootState } from '@devmate/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import FileIcon from '../FileIcon/FileIcon';
import appActions from '@devmate/store/app/actions';
import { IconPlayerPlayFilled, IconX } from '@tabler/icons-react';
import "./EditorView.scss";
import FilePathBreadCrumb from '../FilePathBreadCrumb/FilePathBreadCrumb';
import { generateUUID, getLanguageFromExtension, showNotification } from '@devmate/app/utils/commonFunctions';
import { apiHelper } from '@devmate/app/helpers/apiHelper';
import GlobalOptionsMenu from '../GlobalOptionsMenu/GlobalOptionsMenu';
import { useSocket } from '@devmate/app/context/SocketProvider';

const {
    setCurrentFileData,
    setAllOpenFiles,
    setFileTreeData,
    setIsTerminalOpen,
    setOutputPanelContent,
    setIsAIChatBox,
    setActiveCollabSession
} = appActions;

const EditorView = () => {
    const dispatch = useDispatch();
    const socket = useSocket()
    const isUpdatingRef = useRef(false); // Prevents looping updates
    const AIChatBox = useSelector((state: RootState) => state.app.isAIChatBoxOpen);
    const activeCollabSession = useSelector((state: RootState) => state.app.activeCollabSession);
    const currentFileData = useSelector((state: RootState) => state.app.currentFileData);
    const fileTreeData = useSelector((state: RootState) => state.app.fileTreeData);
    const allOpenFiles = useSelector((state: RootState) => state.app.allOpenFiles);
    const outputPanelContent = useSelector((state: RootState) => state.app.outputPanelContent);
    const [hoverTabId, setHoverTabId] = useState("");
    const [runCodeLoading, setRunCodeLoading] = useState(false);
    const editorMoreOptions = [
        {
            id: 'run_code',
            label: 'Run Code',
            action: (e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                e.preventDefault();
                handleRunCode()
            },
            isGroupEnd: false
        },
        {
            id: 'output_panel',
            label: 'Output Panel',
            action: (e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                e.preventDefault();
                dispatch(setIsAIChatBox({ ...AIChatBox, open: false }))
                dispatch(setIsTerminalOpen(true));
            },
            isGroupEnd: true
        },
        {
            id: 'ai_chat',
            label: 'AI Chat',
            action: () => {
                dispatch(setIsTerminalOpen(false));
                dispatch(setIsAIChatBox({ ...AIChatBox, open: true }))
                dispatch(setActiveCollabSession({
                    ...activeCollabSession,
                    isChatBoxOpen: false
                }))
            },
            isGroupEnd: true
        },
        {
            id: 'close_all_files',
            label: 'Close All',
            action: () => {
                dispatch(setAllOpenFiles([]))
                dispatch(setCurrentFileData({ name: '', path: '', content: "", id: '', parentId: "" }))
            },
            isGroupEnd: false
        },
    ]


    const updateFileTreeContent = (tree: ExplorerItem[], fileId: string, newContent: string): ExplorerItem[] => {
        return tree.map((node) => {
            if (node.id === fileId) {
                return { ...node, content: newContent };
            } else if (node.type === "folder") {
                return { ...node, children: updateFileTreeContent(node.children, fileId, newContent) };
            }
            return node;
        });
    };

    const handleContentChange = (value: string) => {
        if (!currentFileData.id) return;

        const updatedCurrentFile = { ...currentFileData, content: value };

        // Update current file data
        dispatch(setCurrentFileData(updatedCurrentFile));

        // Update allOpenFiles
        const updatedOpenFiles = allOpenFiles.map((file) =>
            file.id === currentFileData.id ? updatedCurrentFile : file
        );
        dispatch(setAllOpenFiles(updatedOpenFiles));

        // Update fileTreeData
        if (fileTreeData) {
            const updatedFileTreeData = updateFileTreeContent(fileTreeData, currentFileData.id, value ?? "");
            dispatch(setFileTreeData(updatedFileTreeData));
        }

        if (isUpdatingRef.current) {
            return; // Skip emitting if it's an update from the server
        }

        socket?.emit("send-code-update", updatedCurrentFile);
    };
    useEffect(() => {
        // Listen for code updates from other users
        socket?.on("receive-code-update", (updatedFile) => { // 🔥 Different event for receiving
            isUpdatingRef.current = true;  // ✅ Set flag to prevent re-emitting
            if (currentFileData.id && currentFileData.id === updatedFile.id) {
                // update current file content
                dispatch(setCurrentFileData({ ...currentFileData, content: updatedFile.content }));
            }
            // update content in allOpenFiles arrays file
            const updatedOpenFiles = allOpenFiles.map((file) =>
                file.id === updatedFile.id ? { ...file, content: updatedFile.content } : file
            );
            dispatch(setAllOpenFiles(updatedOpenFiles));

            // update content in fileTreeData array's file
            if (fileTreeData) {
                const updatedFileTreeData = updateFileTreeContent(fileTreeData, updatedFile.id, updatedFile.content);
                dispatch(setFileTreeData(updatedFileTreeData));
            }

            setTimeout(() => { isUpdatingRef.current = false; }, 500); // ✅ Reset flag after update
        });
        return () => { socket?.off("receive-code-update"); }; // ✅ Cleanup listener

    }, [socket, currentFileData, allOpenFiles, fileTreeData]);

    const handleFileClose = (e: React.MouseEvent<HTMLDivElement>, fileId: string) => {
        e.stopPropagation();
        const fileIndex = allOpenFiles.findIndex((f) => f.id === fileId);
        const updatedFiles = allOpenFiles.filter((f) => f.id !== fileId);
        let newCurrentFile = null;

        if (updatedFiles.length > 0) {
            newCurrentFile = fileIndex === 0
                ? updatedFiles[0]
                : updatedFiles[fileIndex - 1] || updatedFiles[0];
        }

        dispatch(setAllOpenFiles(updatedFiles));
        dispatch(setCurrentFileData(newCurrentFile || { name: '', path: '', content: "", id: '', parentId: "" }));
    }

    const handleRunCode = async () => {
        if (currentFileData.name.includes(".html")) {
            window.open(`/live-preview/${currentFileData.id}`, "_blank");
        } else {
            setRunCodeLoading(true);
            try {
                const data = await apiHelper('/api/runcode', 'POST', {
                    language: getLanguageFromExtension(currentFileData?.path || ""),
                    code: currentFileData?.content ?? "",
                }) as RunCodeResponse;

                if (!data.success) {
                    showNotification({ title: "Error", message: data?.error || "Something went wrong" });
                } else {
                    dispatch(setOutputPanelContent([...outputPanelContent, { ...data.output, file: currentFileData, logId: generateUUID() }]));
                    dispatch(setIsAIChatBox({ ...AIChatBox, open: false }))
                    dispatch(setIsTerminalOpen(true));
                    setRunCodeLoading(false);
                }
                setRunCodeLoading(false);
            } catch (error) {
                setRunCodeLoading(false);
                console.error("Error running code:", error);
            }
        }
    };



    return (
        <Flex className='editor-view'>
            {!isEmpty(allOpenFiles) ?
                <Tabs
                    variant="unstyled"
                    defaultValue={currentFileData.id}
                    value={currentFileData.id}
                    classNames={classes}
                    onChange={(value) => {
                        const selectedFile = allOpenFiles.find((file) => file.id === value);
                        if (selectedFile) {
                            dispatch(setCurrentFileData(selectedFile));
                        }
                    }}
                >
                    <Tabs.List>
                        {allOpenFiles.map((file) => {
                            return (
                                <Tabs.Tab
                                    onMouseOver={() => setHoverTabId(file.id)}
                                    onMouseOut={() => setHoverTabId("")}
                                    value={file.id}
                                    key={file.id}
                                    leftSection={<FileIcon name={file.name} />}
                                    rightSection={
                                        <div
                                            tabIndex={0}
                                            role='button'
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }
                                            }}
                                            onClick={(e) => {
                                                handleFileClose(e, file.id);
                                            }}
                                            aria-label={`Close ${file.name}`}
                                            className={`close-tab-button ${hoverTabId === file.id || currentFileData.id === file.id ? "close-tab-button__visible" : ""}`}
                                        >
                                            <IconX
                                                color="gray"
                                                size={15}
                                                stroke={1.5}
                                            />
                                        </div>
                                    }
                                >
                                    {file.name}
                                </Tabs.Tab>
                            )
                        })}
                    </Tabs.List>
                    <Tabs.Panel
                        keepMounted={false}
                        value={currentFileData.id}
                    >
                        <FilePathBreadCrumb />
                        <EditorComponent
                            content={currentFileData?.content ?? " "}
                            language={getLanguageFromExtension(currentFileData?.name || " ")}
                            onContentChange={handleContentChange}
                        />
                    </Tabs.Panel>
                </Tabs>
                : <Flex flex={1} justify="center" align="center" direction="column" >
                    <div>
                        <Image style={{ borderRadius: "50%" }} src="/app-logo.jpeg" alt="devmate logo" width={150} height={150} />
                    </div>
                    <Title order={3}>Open a file to start coding </Title>
                </Flex>}
            {!!allOpenFiles.length && <Box pos="absolute"
                right="6px"
                top="8px">
                {currentFileData.id && !AIChatBox.open &&
                    <Tooltip label="Run Code" withArrow>
                        <ActionIcon
                            loading={runCodeLoading}
                            onClick={() => handleRunCode()}
                            variant="subtle"
                            color="gray"
                            aria-label="Run Code"
                        >
                            <IconPlayerPlayFilled size={15} />
                        </ActionIcon>
                    </Tooltip>
                }
                <GlobalOptionsMenu items={editorMoreOptions} />
            </Box>}

        </Flex>
    );
}

export default EditorView;