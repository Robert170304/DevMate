"use client"
import { usePathname } from "next/navigation";
import Header from "@devmate/components/Header/Header";
import Footer from "@devmate/components/Footer/Footer";
import { Box, Flex } from '@mantine/core';
import { allRoutes } from "./utils/utility";
import { useEffect } from "react";
import appActions from '@devmate/store/app/actions';
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";

const { setUserData } = appActions

export default function PageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const dispatch = useDispatch()


    useEffect(() => {
        if (session) {
            dispatch(setUserData(session.user as UserResponseDTO))
        } else {
            dispatch(setUserData({ id: "", name: "", email: "", image: "" }))
        }
    }, [session, dispatch])

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
