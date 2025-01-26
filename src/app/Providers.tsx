"use client";
import { MantineProvider } from "@mantine/core";
import { ScreenLoaderProvider } from "./context/ScreenLoaderContext";
import NavigationAutoLoader from "@devmate/components/NavigationAutoLoader/NavigationAutoLoader";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ContextMenuProvider } from "./context/ContextMenuContext";
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from "redux-persist/integration/react";
import FullScreenLoader from "@devmate/components/LoaderFullScreen/LoaderFullScreen";
import { persistor, store } from "@devmate/store/store";

interface ProvidersProps {
    children: React.ReactNode;
    session: Session | null;
}

export default function Providers({ children, session }: Readonly<ProvidersProps>) {

    return (
        <SessionProvider session={session}>
            <ContextMenuProvider>
                <MantineProvider defaultColorScheme="dark" theme={{
                    fontFamily: 'Raleway, sans-serif',
                    headings: { fontFamily: 'Raleway, sans-serif' },
                }} >
                    <ScreenLoaderProvider>
                        <NavigationAutoLoader />
                        <ReduxProvider store={store}>
                            <PersistGate
                                loading={
                                    <FullScreenLoader />
                                }
                                persistor={persistor}
                            >
                                {children}
                            </PersistGate>
                        </ReduxProvider>
                    </ScreenLoaderProvider>
                </MantineProvider>
            </ContextMenuProvider>
        </SessionProvider>
    );
}
