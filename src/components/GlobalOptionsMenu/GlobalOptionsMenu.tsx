import React from 'react';
import { ActionIcon, Menu, MenuItem, type ActionIconProps } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import { useOptionsMenu } from '@devmate/app/context/OptionsMenuContext';


interface OptionsMenuItem {
    id: number | string;
    label: string;
    action: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isGroupEnd: boolean;
}

interface OptionsMenu {
    visible: boolean;
    menuItems: OptionsMenuItem[];
}

interface OptionsMenuProps {
    onOptionsMenuOpen?: () => void;
    onOptionsMenuHide?: () => void;
    items: OptionsMenuItem[];
    btnProps?: ActionIconProps
}

const GlobalOptionsMenu: React.FC<OptionsMenuProps> = ({ onOptionsMenuHide, onOptionsMenuOpen, items, btnProps }) => {
    const { optionsMenu, hideOptionsMenu, showOptionsMenu } = useOptionsMenu() as {
        optionsMenu: OptionsMenu;
        hideOptionsMenu: () => void;
        showOptionsMenu: (menuItems: OptionsMenuItem[]) => void;
    };

    const handleOptionsMenuToggle = () => {
        if (optionsMenu.visible) {
            hideOptionsMenu()
            onOptionsMenuHide?.()
        } else {
            showOptionsMenu(items);
            onOptionsMenuOpen?.()
        }
    };

    return (
        <Menu
            shadow="md"
            width={130}
            onOpen={handleOptionsMenuToggle}
            onClose={handleOptionsMenuToggle}
        >
            <Menu.Target>
                <ActionIcon variant="subtle" color="gray" {...btnProps}>
                    <IconDots size={18} stroke={1.5} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                {optionsMenu.menuItems.map((item) => (
                    <React.Fragment key={item.id}>
                        <MenuItem style={{ fontSize: "13px" }} onClick={item.action}>
                            {item.label}
                        </MenuItem>
                        {item.isGroupEnd && <Menu.Divider />}
                    </React.Fragment>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
};

export default GlobalOptionsMenu;
