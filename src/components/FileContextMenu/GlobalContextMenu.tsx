import React from 'react';
import { ActionIcon, Menu, MenuItem } from '@mantine/core';
import { useContextMenu } from '@devmate/app/context/ContextMenuContext';
import { IconDots } from '@tabler/icons-react';


interface ContextMenuItem {
    id: number | string;
    label: string;
    action: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface ContextMenu {
    visible: boolean;
    menuItems: ContextMenuItem[];
}

interface FileContextMenuProps {
    onContextMenuOpen?: () => void;
    onContextMenuHide?: () => void;
    items: ContextMenuItem[];
}

const GlobalContextMenu: React.FC<FileContextMenuProps> = ({ onContextMenuHide, onContextMenuOpen, items }) => {
    const { contextMenu, hideContextMenu, showContextMenu } = useContextMenu() as {
        contextMenu: ContextMenu;
        hideContextMenu: () => void;
        showContextMenu: (menuItems: ContextMenuItem[]) => void;
    };

    const handleContextMenuToggle = () => {
        if (contextMenu.visible) {
            hideContextMenu()
            onContextMenuHide?.()
        } else {
            showContextMenu(items);
            onContextMenuOpen?.()
        }
    };

    return (
        <Menu
            shadow="md"
            width={130}
            onOpen={handleContextMenuToggle}
            onClose={handleContextMenuToggle}
        >
            <Menu.Target>
                <ActionIcon variant="subtle" color="gray" aria-label="Add File">
                    <IconDots size={18} stroke={1.5} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                {contextMenu.menuItems.map((item) => (
                    <MenuItem key={item.id} onClick={item.action}>
                        {item.label}
                    </MenuItem>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};

export default GlobalContextMenu;
