import React, { createContext, useContext, useState } from 'react';

interface OptionsMenuState {
    visible: boolean;
    menuItems: {
        id: string | number;
        label: string;
        action: (e: React.MouseEvent<HTMLButtonElement>) => void;
        isGroupEnd: boolean;
    }[];
}

interface OptionsMenuProps {
    optionsMenu: OptionsMenuState;
    showOptionsMenu: (menuItems: OptionsMenuState['menuItems']) => void;
    hideOptionsMenu: () => void;
    isOptionsMenuBtnVisible: boolean;
    showOptionsMenuBtn: () => void;
    hideOptionsMenuBtn: () => void;
}

const OptionsMenu = createContext<OptionsMenuProps | undefined>(undefined);

export const OptionsMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [optionsMenu, setOptionsMenu] = useState<OptionsMenuState>({
        visible: false,
        menuItems: [],
    });

    const [isOptionsMenuBtnVisible, setIsOptionsMenuBtnVisible] = useState(false);

    const showOptionsMenu = (menuItems: OptionsMenuState['menuItems']) => {
        setOptionsMenu({ visible: true, menuItems });
    };

    const hideOptionsMenu = () => {
        setOptionsMenu((prev) => ({ ...prev, visible: false }));
    };

    const showOptionsMenuBtn = () => {
        setIsOptionsMenuBtnVisible(true);
    }

    const hideOptionsMenuBtn = () => {
        setIsOptionsMenuBtnVisible(false);
    }

    const optionsValue = React.useMemo(() => ({
        optionsMenu,
        showOptionsMenu,
        hideOptionsMenu,
        isOptionsMenuBtnVisible,
        showOptionsMenuBtn,
        hideOptionsMenuBtn
    }), [optionsMenu, isOptionsMenuBtnVisible]);

    return (
        <OptionsMenu.Provider value={optionsValue}>
            {children}
        </OptionsMenu.Provider>
    );
};

export const useOptionsMenu = () => {
    const options = useContext(OptionsMenu);
    if (!options) {
        throw new Error('useOptionsMenu must be used within a OptionsMenuProvider');
    }
    return options;
};
