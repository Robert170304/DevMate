"use client"
import { usePathname } from "next/navigation";
import Header from "@devmate/components/Header/Header";
import Footer from "@devmate/components/Footer/Footer";
import { Box, Flex } from '@mantine/core';
import { allRoutes } from "./utils/utility";

export default function PageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();

    return (
        <Flex direction="column" mih="100vh">
            <Box flex="1" display="flex" className="layout-box">
                {(pathname !== "/workspace" && allRoutes.find((route) => route.path === pathname)) && <Header />}
                <Box
                    className="layout-container"
                    flex="1"
                    display="flex"
                    p={0}
                >
                    {children}
                </Box>

                {(pathname !== "/workspace" && allRoutes.find((route) => route.path === pathname)) && <Footer />}
            </Box>
        </Flex>
    );
}
