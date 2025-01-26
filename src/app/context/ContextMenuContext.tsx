import React, { createContext, useContext, useState } from 'react';

interface ContextMenuState {
    visible: boolean;
    menuItems: { id: string | number; label: string; action: (e: React.MouseEvent<HTMLButtonElement>) => void; }[];
}

interface ContextMenuContextProps {
    contextMenu: ContextMenuState;
    showContextMenu: (menuItems: ContextMenuState['menuItems']) => void;
    hideContextMenu: () => void;
    isContextMenuBtnVisible: boolean;
    showContextMenuBtn: () => void;
    hideContextMenuBtn: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextProps | undefined>(undefined);

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        visible: false,
        menuItems: [],
    });

    const [isContextMenuBtnVisible, setIsContextMenuBtnVisible] = useState(false);

    const showContextMenu = (menuItems: ContextMenuState['menuItems']) => {
        setContextMenu({ visible: true, menuItems });
    };

    const hideContextMenu = () => {
        setContextMenu((prev) => ({ ...prev, visible: false }));
    };

    const showContextMenuBtn = () => {
        setIsContextMenuBtnVisible(true);
    }

    const hideContextMenuBtn = () => {
        setIsContextMenuBtnVisible(false);
    }

    const contextValue = React.useMemo(() => ({
        contextMenu,
        showContextMenu,
        hideContextMenu,
        isContextMenuBtnVisible,
        showContextMenuBtn,
        hideContextMenuBtn
    }), [contextMenu, isContextMenuBtnVisible]);

    return (
        <ContextMenuContext.Provider value={contextValue}>
            {children}
        </ContextMenuContext.Provider>
    );
};

export const useContextMenu = () => {
    const context = useContext(ContextMenuContext);
    if (!context) {
        throw new Error('useContextMenu must be used within a ContextMenuProvider');
    }
    return context;
};
