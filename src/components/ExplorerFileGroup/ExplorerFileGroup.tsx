import { useState } from 'react';
import { IconChevronRight, IconFolderFilled, IconFolderOpen } from '@tabler/icons-react';
import { Box, Button, Collapse, Flex, Group, Image, Text, TextInput, UnstyledButton } from '@mantine/core';
import FileIcon from '../FileIcon/FileIcon';
import './ExplorerFileGroup.scss';
import appActions from '@devmate/store/app/actions';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';
import { useContextMenu } from 'react-contexify';
import ContextMenu from '../ContextMenu/ContextMenu';

const { setCurrentFileData, setAllOpenFiles } = appActions;
interface ExplorerFileGroupProps {
    item: ExplorerFileGroupDTO;
    lastClickedId: string | null;
    editingFileId: string | null;
    setLastClickedId: (id: string) => void;
    deleteFileOrFolder: (id: string) => void;
    setEditingFileId: (id: string | null) => void;
    newFileFolderName: string;
    updateFileOrFolderName: (id: string, newName: string) => void;
    creatingItem: { parentId: string | null; type: 'file' | 'folder' } | null;
    handleAddFile: (parentId?: string | null) => void;
    handleAddFolder: (parentId?: string | null) => void;
    onNameInputBlur: () => void;
    onNameInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNameInput: (e: React.KeyboardEvent<HTMLInputElement>, parentId: string | null, isFile: boolean) => void;
}

const ExplorerFileGroup: React.FC<ExplorerFileGroupProps> = ({
    item,
    lastClickedId,
    setLastClickedId,
    creatingItem,
    onNameInput,
    onNameInputBlur,
    onNameInputChange,
    editingFileId,
    setEditingFileId,
    updateFileOrFolderName,
    handleAddFile,
    handleAddFolder,
    deleteFileOrFolder,
    newFileFolderName
}) => {
    const { name, type, children, id, content, path } = item;
    const FILE_MENU_ID = `file_menu_${id}`
    const FOLDER_MENU_ID = `folder_menu_${id}`

    const fileContextMenuItems = [
        {
            id: 'rename',
            label: 'Rename',
            action: () => {
                setFileMenuActionName('Edit')
                setEditingFileId(id);
            }
        },
        {
            id: 'delete',
            label: 'Delete',
            action: () => {
                // setFileMenuActionName('Delete')
                deleteFileOrFolder(id);
            }
        },
    ]
    const folderContextMenuItems = [
        {
            id: 'new_file',
            label: 'New File',
            action: () => {
                setLastClickedId(id)
                handleAddFile(id)
            }
        },
        {
            id: 'new_folder',
            label: 'New Folder',
            action: () => {
                setLastClickedId(id)
                handleAddFolder(id)
            }
        },
        {
            id: 'rename',
            label: 'Rename',
            action: () => {
                setFileMenuActionName('Edit')
                setEditingFileId(id);
            }
        },
        {
            id: 'delete',
            label: 'Delete',
            action: () => deleteFileOrFolder(id)
        },
    ]
    const dispatch = useDispatch();
    const currentFileData = useSelector((state: RootState) => state.app.currentFileData);
    const allOpenFiles = useSelector((state: RootState) => state.app.allOpenFiles);
    const [opened, setOpened] = useState(false);
    // const [fileHoverId, setFileHoverId] = useState("");
    const [fileMenuActionName, setFileMenuActionName] = useState("");
    const [newName, setNewName] = useState(name);
    const fileContextMenu = useContextMenu({ id: FILE_MENU_ID });
    const folderContextMenu = useContextMenu({ id: FOLDER_MENU_ID });

    // Check if the current group has nested children
    const hasChildren = Array.isArray(children) && children.length > 0;

    // Render nested LinksGroup recursively for folder children
    const nestedItems = hasChildren
        ? children.map((child) => (
            <ExplorerFileGroup
                creatingItem={creatingItem}
                onNameInput={onNameInput}
                key={child.id}
                item={child}
                lastClickedId={lastClickedId} // Pass the state down
                setLastClickedId={setLastClickedId} // Pass the state setter
                onNameInputBlur={onNameInputBlur}
                onNameInputChange={onNameInputChange}
                editingFileId={editingFileId}
                setEditingFileId={setEditingFileId}
                updateFileOrFolderName={updateFileOrFolderName}
                handleAddFile={handleAddFile}
                handleAddFolder={handleAddFolder}
                deleteFileOrFolder={deleteFileOrFolder}
                newFileFolderName={newFileFolderName}
            />))
        : null;

    const handleFolderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (fileMenuActionName === "Edit") return;
        e.stopPropagation(); // Prevent the click from bubbling up
        setOpened((prev) => !prev);
        setLastClickedId(id); // Update the last clicked folder ID
    };

    const handleFileNameSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newName.trim()) {
            updateFileOrFolderName(id, newName.trim());
            setFileMenuActionName("")
        } else if (e.key === 'Escape') {
            setEditingFileId(null); // Cancel editing
            setFileMenuActionName("")
        }

    };

    const handleFileNameBlur = () => {
        if (newName.trim()) {
            updateFileOrFolderName(id, newName.trim());
        } else {
            setEditingFileId(null); // Cancel editing
        }
        setFileMenuActionName("")
    };

    const onFileOpen = () => {
        if (currentFileData.id === id) return;
        dispatch(setCurrentFileData({ content, name, id, path }));
        if (!allOpenFiles.find((file) => file.id === id)) {
            dispatch(setAllOpenFiles([...allOpenFiles, { content, name, id, path }]));
        }
    };

    let folderIcon;
    if (name === "devmate") {
        folderIcon = <Image style={{ borderRadius: "50%" }} src="/app-logo.jpeg" alt="devmate logo" width={25} height={25} />;
    } else if (opened) {
        folderIcon = <IconFolderOpen className="folder-open__icon" stroke={1.5} size={16} />;
    } else {
        folderIcon = <IconFolderFilled className="folder-collapse__chevron folder-close__icon" stroke={1.5} size={16} />;
    }

    function handleContextMenu(event: React.MouseEvent, menuId: string) {
        event.preventDefault(); // Prevent default right-click behavior

        if (menuId === FILE_MENU_ID) {
            fileContextMenu.show({ event });
        } else {
            folderContextMenu.show({ event });
        }
    }

    return (
        <div className="files-group" >
            {type === 'folder' ? (
                <>
                    <Flex pos="relative" display="flex" align="center" gap="xs" onContextMenu={(e) => handleContextMenu(e, FOLDER_MENU_ID)}>
                        <UnstyledButton
                            className={`folder-collapse___control ${opened ? "folder-collapse__control_open" : ""} ${lastClickedId === id ? "folder-collapse__active" : ""}`}
                            onClick={handleFolderClick}
                        >
                            <Group justify="space-between" gap={0}>
                                <Box style={{ display: 'flex', alignItems: 'center', gap: "10px", width: "90%" }}>
                                    {folderIcon}

                                    {fileMenuActionName === "Edit" && editingFileId === id ?
                                        <TextInput
                                            className='editing-file-name-input'
                                            size="xs"
                                            onChange={(e) => setNewName(e.target.value)}
                                            onKeyDown={handleFileNameSave}
                                            onBlur={handleFileNameBlur}
                                            autoFocus
                                            placeholder="Enter folder name"
                                            defaultValue={name}
                                        /> :
                                        <Text fz="sm" >{name}</Text>
                                    }
                                </Box>
                                <IconChevronRight
                                    className="folder-collapse__chevron"
                                    stroke={1.5}
                                    size={13}
                                    style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
                                />
                            </Group>
                        </UnstyledButton>
                    </Flex>
                    {creatingItem && creatingItem.parentId === id && (
                        <div className="creating-file-input__container">
                            {creatingItem.type === "file" ? <FileIcon name={newFileFolderName} /> : <IconFolderFilled className="folder-collapse__chevron"
                                stroke={1.5}
                                size={16} />}
                            <TextInput
                                size="xs"
                                className="creating-file-input"
                                onChange={onNameInputChange}
                                autoFocus
                                onBlur={onNameInputBlur}
                                placeholder={`Enter ${creatingItem.type} name`}
                                onKeyDown={(e) => onNameInput(e, id, creatingItem.type === 'file')}
                            />
                        </div>

                    )}

                    {hasChildren && (
                        <Collapse in={opened} className="folder-collapse__nested">
                            {nestedItems}
                        </Collapse>
                    )}
                </>
            ) : (
                <Flex display="flex" align="center" gap="xs"
                >
                    <Button
                        variant="transparent"
                        color="dark"
                        radius="md"
                        className={`file-name__link ${currentFileData.id === id ? "file-name__link_active" : ""}`}
                        onClick={onFileOpen}
                        onContextMenu={(e) => handleContextMenu(e, FILE_MENU_ID)}
                    >
                        <FileIcon name={newName || name} />
                        {fileMenuActionName === "Edit" && editingFileId === id ?
                            <TextInput
                                className='editing-file-name-input'
                                size="xs"
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyDown={handleFileNameSave}
                                onBlur={handleFileNameBlur}
                                autoFocus
                                placeholder="Enter file name"
                                defaultValue={name}
                            /> :
                            <Text>{name}</Text>
                        }
                    </Button>
                </Flex>
            )}
            <ContextMenu
                items={type === 'folder' ? folderContextMenuItems : fileContextMenuItems}
                menuId={type === 'folder' ? FOLDER_MENU_ID : FILE_MENU_ID}
            />
        </div>
    );
};

export default ExplorerFileGroup;
