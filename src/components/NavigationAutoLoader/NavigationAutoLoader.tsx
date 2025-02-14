'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useScreenLoader } from '@devmate/app/context/ScreenLoaderContext';

export default function NavigationAutoLoader() {
    const { showLoader, hideLoader } = useScreenLoader();
    const pathname = usePathname();

    useEffect(() => {
        showLoader();
        const timer = setTimeout(() => hideLoader(), 1000); // Simulate loader delay
        return () => clearTimeout(timer); // Cleanup on unmount
    }, [pathname]);

    return null; // No visible component
}
