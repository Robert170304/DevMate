// FileContextMenu.tsx
import { ActionIcon, Menu, MenuItem } from '@mantine/core';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';

interface FileContextMenuProps {
    onToggle: (val: boolean) => void;
}

const FileContextMenu: React.FC<FileContextMenuProps> = ({ onToggle }) => {
    return (
        <Menu
            shadow="md"
            width={200}
            onOpen={() => onToggle(true)}
            onClose={() => onToggle(false)}
        >
            <Menu.Target>
                <ActionIcon variant="subtle" color="gray" aria-label="Add File">
                    <IconDots size={18} stroke={1.5} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <MenuItem leftSection={<IconEdit size={16} />}>
                    Edit
                </MenuItem>
                <MenuItem leftSection={<IconTrash size={16} />}>
                    Delete
                </MenuItem>
            </Menu.Dropdown>
        </Menu>
    );
};

export default FileContextMenu;
