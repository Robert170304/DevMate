import { ActionIcon, Button, Group, ScrollArea, Text, TextInput, Title } from '@mantine/core';
import LinksGroup from '../ExplorerFileGroup/ExplorerFileGroup';
import { useEffect, useRef, useState } from 'react';
import { IconFilePlus, IconFolderFilled, IconFolderPlus } from '@tabler/icons-react';
import FileIcon from '../FileIcon/FileIcon';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';
import appActions from '@devmate/store/app/actions';
import './Explorer.scss';
import { collectFileIds, findFileOrFolderById, getFileDefaultContent, getFileExtension } from '@devmate/app/utils/commonFunctions';

const { setCurrentFileData, setAllOpenFiles, setFileTreeData } = appActions;

const Explorer: React.FC = () => {
    const dispatch = useDispatch();
    const fileTreeData = useSelector((state: RootState) => state.app.fileTreeData);
    const allOpenFiles = useSelector((state: RootState) => state.app.allOpenFiles);
    const currentFileData = useSelector((state: RootState) => state.app.currentFileData);
    const explorerNavbarRef = useRef<HTMLDivElement>(null);
    const addFileActionBtnRef = useRef<HTMLButtonElement>(null);
    const addFolderActionBtnRef = useRef<HTMLButtonElement>(null);
    const [explorerData, setExplorerData] = useState<ExplorerItem[]>([]);
    const [lastClickedId, setLastClickedId] = useState<string | null>(null); // State for the last clicked folder
    const [newFileFolderName, setNewFileFolderName] = useState<string>(""); // State for the last clicked folder
    const [editingFileId, setEditingFileId] = useState<string | null>(null); // Track the item being edited
    const [creatingItem, setCreatingItem] = useState<{
        parentId: string | null;
        type: 'file' | 'folder';
    } | null>(null); // Tracks the item being created

    useEffect(() => {
        if (fileTreeData) {
            setExplorerData(fileTreeData);
        }
    }, [fileTreeData]);

    const addFileOrFolder = (parentId: string | null, name: string, isFile: boolean) => {
        const newItem: ExplorerItem = isFile
            ? {
                id: `${Date.now()}`,
                name: name || `New File ${Date.now()}.txt`,
                type: 'file',
                content: getFileDefaultContent(getFileExtension(name)),
                path: parentId ? '' : name || `New File ${Date.now()}.txt`, // Temporary placeholder
            }
            : {
                id: `${Date.now()}`,
                name: name || `New Folder ${Date.now()}`,
                type: 'folder',
                children: [],
                path: parentId ? '' : name || `New Folder ${Date.now()}`, // Temporary placeholder
            };

        const addToExplorer = (
            data: ExplorerItem[],
            parentId: string | null,
            newItem: ExplorerItem
        ): ExplorerItem[] => {
            return data.map((item) => {
                // Build the path for the new item based on the parent's path
                const newItemWithPath = {
                    ...newItem,
                    path: `${item.path}/${newItem.name}`,
                };
                // Check if this is the target folder
                if (item.type === 'folder' && item.id === parentId) {
                    return {
                        ...item,
                        children: [...item.children, newItemWithPath],
                    };
                }

                // If it's not the target, recurse into children if it's a folder
                if (item.type === 'folder') {
                    return {
                        ...item,
                        children: addToExplorer(item.children, parentId, newItem),
                    };
                }

                // Return item as is for non-target cases
                return item;
            });
        };

        // If no folder is selected, add to root
        const updatedData = parentId
            ? addToExplorer(explorerData, parentId, newItem)
            : [
                ...explorerData,
                {
                    ...newItem,
                    path: newItem.name, // For root-level items, the path is just the name
                },
            ];

        dispatch(setFileTreeData(updatedData))
        const newFileData = findFileOrFolderById(updatedData, newItem.id);
        if (newFileData && newFileData.type === 'file') {
            // Open the newly created file
            dispatch(setCurrentFileData({
                id: newFileData.id,
                name: newFileData.name,
                content: newFileData.content,
                path: newFileData.path,
            }));

            // Add it to allOpenFiles in the Redux store
            dispatch(setAllOpenFiles([...allOpenFiles, {
                id: newFileData.id,
                name: newFileData.name,
                content: newFileData.content,
                path: newFileData.path,
            }]));
        }
        setCreatingItem(null);
        setNewFileFolderName("");
    };

    const updateFileOrFolderName = (id: string, newName: string) => {
        const updateNameAndPathRecursively = (data: ExplorerItem[], parentPath: string = ""): ExplorerItem[] =>
            data.map((item) => {
                if (item.id === id) {
                    // Update the name and the path for the matched item
                    const updatedPath = parentPath ? `${parentPath}/${newName}` : newName;

                    const updatedItem = {
                        ...item,
                        name: newName,
                        path: updatedPath,
                    };

                    return updatedItem;
                }
                if (item.type === "folder") {
                    return {
                        ...item,
                        children: updateNameAndPathRecursively(item.children, item.path),
                    };
                }
                return item;
            });
        if (fileTreeData) {
            dispatch(setFileTreeData(updateNameAndPathRecursively(fileTreeData)))
        }

        // Update All Open Files
        const updatedOpenFiles = allOpenFiles.map((file) => {
            if (file.id === id) {
                const updatedPath = file.path.split("/").slice(0, -1).join("/") + `/${newName}`;
                return {
                    ...file,
                    name: newName,
                    path: updatedPath,
                };
            }
            return file;
        });
        dispatch(setAllOpenFiles(updatedOpenFiles));

        // Update Current File Data
        if (currentFileData?.id === id) {
            const updatedPath = currentFileData.path.split("/").slice(0, -1).join("/") + `/${newName}`;
            dispatch(
                setCurrentFileData({
                    ...currentFileData,
                    name: newName,
                    path: updatedPath,
                })
            );
        }

        setEditingFileId(null); // Exit edit mode after updating
    };

    const handleFileSwitch = (fileId: string, latestOpenFiles: { name: string, path: string, content: string | undefined, id: string }[]) => {
        const fileIndex = latestOpenFiles.findIndex((f) => f.id === fileId);
        const updatedFiles = latestOpenFiles.filter((f) => f.id !== fileId);
        let newCurrentFile = null;

        if (updatedFiles.length > 0) {
            newCurrentFile = fileIndex === 0
                ? updatedFiles[0]
                : updatedFiles[fileIndex - 1] || updatedFiles[0];
        }

        dispatch(setCurrentFileData(newCurrentFile || { name: '', path: '', content: undefined, id: '' }));
    }

    const deleteFileOrFolder = (id: string) => {
        const deleteRecursively = (data: ExplorerItem[]): ExplorerItem[] =>
            data
                .filter((item) => item.id !== id) // Filter out the item to delete
                .map((item) => {
                    if (item.type === 'folder') {
                        // Return a new folder object with updated children
                        return {
                            ...item,
                            children: deleteRecursively(item.children),
                        };
                    }
                    return item; // Return file objects as is
                });

        if (fileTreeData) {
            const fileIdsToDelete = collectFileIds(fileTreeData, id); // Get all file IDs in the folder

            // Dispatch the new file tree data without mutating the state
            const updatedData = deleteRecursively(fileTreeData);
            dispatch(setFileTreeData(updatedData));

            // Remove all files inside the deleted folder from open files
            const updatedOpenFiles = allOpenFiles.filter((file) => !fileIdsToDelete.includes(file.id));
            dispatch(setAllOpenFiles(updatedOpenFiles));

            // If the current file is deleted, switch to another file
            if (currentFileData && fileIdsToDelete.includes(currentFileData.id)) {
                handleFileSwitch(currentFileData.id, updatedOpenFiles);
            }
        }
        setLastClickedId(null);
    };


    const handleAddFile = (parentId?: string | null) => {
        setCreatingItem({ parentId: parentId ?? lastClickedId, type: 'file' });
    };

    const handleAddFolder = (parentId?: string | null) => {
        setCreatingItem({ parentId: parentId ?? lastClickedId, type: 'folder' });
    };

    const handleNameInput = (e: React.KeyboardEvent<HTMLInputElement>, parentId: string | null, isFile: boolean) => {
        if (e.key === 'Enter') {
            const name = (e.target as HTMLInputElement).value.trim();
            if (name) {
                addFileOrFolder(parentId, name, isFile);
            } else {
                setCreatingItem(null);
                setNewFileFolderName("");
            }
        }
        if (e.key === 'Escape') {
            setCreatingItem(null);
            setNewFileFolderName("");
        }
    }

    const onNameInputBlur = () => {
        if (newFileFolderName) {
            addFileOrFolder(creatingItem?.parentId ?? null, newFileFolderName, creatingItem?.type === 'file');
        } else {
            setCreatingItem(null);
            setNewFileFolderName("");
        }
    }

    const onNameInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewFileFolderName(e.currentTarget.value);
    }

    const handleNavClick = (e: React.MouseEvent) => {
        // // Check if the click was inside the button
        if (addFolderActionBtnRef.current?.contains(e.target as Node) || addFileActionBtnRef.current?.contains(e.target as Node)) {
            // If clicked inside the button, don't reset the ID
            return;
        }

        if (explorerNavbarRef.current?.contains(e.target as Node)) {
            // If clicked inside the explorer-navbar__content, don't reset the ID
            return;
        }
        setLastClickedId(null); // Reset ID only if click is outside the buttons
    };

    return (
        <nav className="explorerNavbar" onClickCapture={handleNavClick} >
            <div className="explorer-navbar__header"  >
                <Group justify="space-between" w="100%">
                    <Title className="explorer-navbar__title" order={5}>
                        Explorer
                    </Title>
                    <Group gap={7} >
                        <ActionIcon ref={addFileActionBtnRef} onClick={() => handleAddFile()} variant="filled" aria-label="Add File" className="add-file-btn">
                            <IconFilePlus size={18} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon ref={addFolderActionBtnRef} onClick={() => handleAddFolder()} variant="filled" aria-label="Add Folder" className="add-file-btn">
                            <IconFolderPlus size={18} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </Group>
            </div>

            <ScrollArea className="explorer-navbar__scrollarea">
                <div className="explorer-navbar__content" ref={explorerNavbarRef}>
                    {/* Render root-level LinksGroup components */}
                    {explorerData.map((item) => (
                        <LinksGroup
                            lastClickedId={lastClickedId} // Pass the state down
                            setLastClickedId={setLastClickedId} // Pass the state setter
                            key={item.id}
                            item={item}
                            creatingItem={creatingItem}
                            onNameInput={handleNameInput}
                            onNameInputBlur={onNameInputBlur}
                            onNameInputChange={onNameInputChange}
                            editingFileId={editingFileId}
                            setEditingFileId={setEditingFileId}
                            updateFileOrFolderName={updateFileOrFolderName}
                            handleAddFile={handleAddFile}
                            deleteFileOrFolder={deleteFileOrFolder}
                            handleAddFolder={handleAddFolder}
                            newFileFolderName={newFileFolderName}
                        />
                    ))}
                    {isEmpty(explorerData) && (
                        <div className="empty-explorer-content">
                            <Text fz="md" >Start a new project</Text>
                            <Button w="100%" onClick={() => handleAddFolder()} variant="filled">
                                Create
                            </Button>
                        </div>
                    )}
                    {/* Render the creatingItem input */}
                    {creatingItem && !creatingItem.parentId && (
                        <div className="creating-file-input__container">
                            {creatingItem.type === "file" ?
                                <FileIcon name={newFileFolderName} /> :
                                <IconFolderFilled
                                    className="folder-collapse__chevron"
                                    stroke={1.5}
                                    size={16}
                                />
                            }
                            <TextInput
                                size="xs"
                                onChange={onNameInputChange}
                                autoFocus
                                className="creating-file-input"
                                placeholder={isEmpty(explorerData) ? `Enter project name` : `Enter ${creatingItem.type} name`}
                                onBlur={onNameInputBlur}
                                onKeyDown={(e) => handleNameInput(e, null, creatingItem.type === 'file')}
                            />
                        </div>
                    )}
                </div>
            </ScrollArea>
        </nav>
    );
};

export default Explorer;
