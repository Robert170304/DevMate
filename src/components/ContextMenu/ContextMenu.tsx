import React from 'react';
import { Menu, Item } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

interface ContextMenuProps {
    menuId: string;
    items: { id: string; label: string; action: () => void }[];
    theme?: "light" | "dark";
    animation?: "scale" | "fade" | "flip" | "none";
}

const ContextMenu: React.FC<ContextMenuProps> = ({ menuId, items, theme = "dark", animation = "scale" }) => {

    return (
        <Menu id={menuId} theme={theme} animation={animation}>
            {items.map((item) => (
                <Item key={item.id} id={item.id} onClick={item.action}>
                    {item.label}
                </Item>
            ))}
        </Menu>
    );
};

export default ContextMenu;