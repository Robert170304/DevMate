// context/LoaderContext.tsx
import FullScreenLoader from '@devmate/components/LoaderFullScreen/LoaderFullScreen';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const LoaderContext = createContext({
    isLoading: false,
    loaderText: '',
    showLoader: () => { },
    hideLoader: () => { },
});

export const ScreenLoaderProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loaderText, setLoaderText] = useState('');
    const showLoader = (text = '') => {
        setIsLoading(true);
        setLoaderText(text);
    };
    const hideLoader = () => {
        setIsLoading(false);
        setLoaderText('');
    };

    const value = React.useMemo(() => ({ isLoading, loaderText, showLoader, hideLoader }), [isLoading, loaderText]);

    return (
        <LoaderContext.Provider value={value}>
            {children}
            {isLoading && <FullScreenLoader />}
        </LoaderContext.Provider>
    );
};

export const useScreenLoader = () => useContext(LoaderContext);

