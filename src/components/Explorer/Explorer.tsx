import { ActionIcon, Button, Group, ScrollArea, Text, TextInput, Title } from '@mantine/core';
import './Explorer.scss';
import LinksGroup from '../ExplorerFileGroup/ExplorerFileGroup';
import { useRef, useState } from 'react';
import { IconFilePlus, IconFolderFilled, IconFolderPlus } from '@tabler/icons-react';
import FileIcon from '../FileIcon/FileIcon';
import { isEmpty } from 'lodash';

const Explorer: React.FC = () => {
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

    const addFileOrFolder = (parentId: string | null, name: string, isFile: boolean) => {
        const newItem: ExplorerItem = isFile
            ? {
                id: `${Date.now()}`,
                name: name || `New File ${Date.now()}.txt`,
                type: 'file',
                content: '// New file content',
            }
            : {
                id: `${Date.now()}`,
                name: name || `New Folder ${Date.now()}`,
                type: 'folder',
                children: [],
            };

        const addToExplorer = (
            data: ExplorerItem[],
            parentId: string,
            newItem: ExplorerItem
        ): ExplorerItem[] => {
            return data.map((item) => {
                // Check if this is the target folder
                if (item.type === 'folder' && item.id === parentId) {
                    return {
                        ...item,
                        children: [...item.children, newItem],
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
            : [...explorerData, newItem];

        setExplorerData(updatedData);
        setCreatingItem(null);
        setNewFileFolderName("");
    };

    const updateFileOrFolderName = (id: string, newName: string) => {
        const updateNameRecursively = (data: ExplorerItem[]): ExplorerItem[] =>
            data.map((item) => {
                if (item.id === id) {
                    return { ...item, name: newName };
                }
                if (item.type === 'folder') {
                    return { ...item, children: updateNameRecursively(item.children) };
                }
                return item;
            });

        setExplorerData(updateNameRecursively(explorerData));
        setEditingFileId(null); // Exit edit mode after updating
    };

    const deleteFileOrFolder = (id: string) => {
        const deleteRecursively = (data: ExplorerItem[]): ExplorerItem[] =>
            data.filter((item) => {
                if (item.id === id) return false; // Skip the item to delete
                if (item.type === 'folder') {
                    item.children = deleteRecursively(item.children); // Check inside folders
                }
                return true;
            });

        setExplorerData(deleteRecursively(explorerData));
    };

    const handleAddFile = (parentId?: string | null) => {
        console.log("🚀 ~ handleAddFile ~ lastClickedId:", lastClickedId)
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
        console.log("🚀 ~ handleNavClick ~ e:", e)
        // // Check if the click was inside the button
        if (addFolderActionBtnRef.current?.contains(e.target as Node) || addFileActionBtnRef.current?.contains(e.target as Node)) {
            // If clicked inside the button, don't reset the ID
            return;
        }

        if (explorerNavbarRef.current?.contains(e.target as Node)) {
            // If clicked inside the explorer-navbar__content, don't reset the ID
            return;
        }
        setLastClickedId(null);
        // setLastClickedId(null); // Reset ID only if click is outside the buttons
        console.log("🚀 ~ handleNavClick ~ lastClickedId:", lastClickedId)
    };

    return (
        <nav className="explorerNavbar" onClickCapture={handleNavClick} >
            <div className="explorer-navbar__header"  >
                <Group justify="space-between" w="100%">
                    <Title className="explorer-navbar__title" order={5}>
                        Explorer
                    </Title>
                    <Group gap={7} >
                        <ActionIcon ref={addFileActionBtnRef} onClick={() => handleAddFile()} variant="filled" color="gray" aria-label="Add File" className="add-file-btn">
                            <IconFilePlus size={18} stroke={1.5} />
                        </ActionIcon>
                        <ActionIcon ref={addFolderActionBtnRef} onClick={() => handleAddFolder()} variant="filled" color="gray" aria-label="Add Folder" className="add-file-btn">
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
                                <IconFolderFilled className="folder-collapse__chevron"
                                    stroke={1.5}
                                    size={16} />
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
