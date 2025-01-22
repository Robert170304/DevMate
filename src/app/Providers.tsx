"use client";
import { MantineProvider } from "@mantine/core";
import { ScreenLoaderProvider } from "./context/ScreenLoaderContext";
import NavigationAutoLoader from "@devmate/components/NavigationAutoLoader/NavigationAutoLoader";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ProvidersProps {
    children: React.ReactNode;
    session: Session | null;
}

export default function Providers({ children, session }: Readonly<ProvidersProps>) {

    return (
        <SessionProvider session={session}>
            <MantineProvider defaultColorScheme="dark" theme={{
                fontFamily: 'Raleway, sans-serif',
                headings: { fontFamily: 'Raleway, sans-serif' },
            }} >
                <ScreenLoaderProvider>
                    <NavigationAutoLoader />
                    {children}
                </ScreenLoaderProvider>
            </MantineProvider>
        </SessionProvider>
    );
}
