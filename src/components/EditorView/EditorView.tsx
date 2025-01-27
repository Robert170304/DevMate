import { Flex, Image, Tabs, Title } from '@mantine/core';
import classes from "./EditorViewTabs.module.scss"
import EditorComponent from '../EditorComponent/EditorComponent';
import React, { useState } from 'react';
import type { RootState } from '@devmate/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import FileIcon from '../FileIcon/FileIcon';
import appActions from '@devmate/store/app/actions';
import { IconX } from '@tabler/icons-react';
import "./EditorView.scss"
import { languageMap } from '@devmate/app/utils/utility';
import FilePathBreadCrumb from '../FilePathBreadCrumb/FilePathBreadCrumb';

const { setCurrentFileData, setAllOpenFiles, setFileTreeData } = appActions;

const EditorView = () => {
    const dispatch = useDispatch();
    const currentFileData = useSelector((state: RootState) => state.app.currentFileData);
    const fileTreeData = useSelector((state: RootState) => state.app.fileTreeData);
    const allOpenFiles = useSelector((state: RootState) => state.app.allOpenFiles);
    const [hoverTabId, setHoverTabId] = useState("");

    const getLanguageFromExtension = (filePath: string) => {
        const extension = filePath.split(".").pop();
        const fileExtension = languageMap[extension ?? ""] || "plaintext";
        return fileExtension
    };

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

    const handleContentChange = (value: string | undefined) => {
        if (!currentFileData || !value) return;

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
            const updatedFileTreeData = updateFileTreeContent(fileTreeData, currentFileData.id, value);
            dispatch(setFileTreeData(updatedFileTreeData));
        }
    };



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
        dispatch(setCurrentFileData(newCurrentFile || { name: '', path: '', content: undefined, id: '' }));
    }


    return (
        <Flex className='editor-view'>
            {!isEmpty(allOpenFiles) ?
                <Tabs
                    variant="unstyled"
                    defaultValue={currentFileData.id}
                    value={currentFileData.id}
                    classNames={classes}
                    onChange={(value) => {
                        console.log("🚀 ~ value:", value)
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
                                            className={`close-tab-button ${hoverTabId === file.id ? "close-tab-button__visible" : ""}`}
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
                    {allOpenFiles.map((file) => {
                        return (
                            <Tabs.Panel
                                keepMounted={false}
                                value={file.id}
                                key={file.id}
                            >
                                <FilePathBreadCrumb />
                                <EditorComponent
                                    content={file?.content as string || " "}
                                    language={getLanguageFromExtension(file?.name || " ")}
                                    onContentChange={handleContentChange}
                                />
                            </Tabs.Panel>
                        )
                    })}
                </Tabs>
                : <Flex flex={1} justify="center" align="center" direction="column" >
                    <div>
                        <Image style={{ borderRadius: "50%" }} src="/app-logo.jpeg" alt="devmate logo" width={150} height={150} />
                    </div>
                    <Title order={3}>Open a file to start coding </Title>
                </Flex>}
        </Flex>
    );
}

export default EditorView;