"use client"
import { useParams, usePathname, useRouter } from "next/navigation";
import Header from "@devmate/components/Header/Header";
import Footer from "@devmate/components/Footer/Footer";
import { Box, Flex } from '@mantine/core';
import { useEffect } from "react";
import appActions from '@devmate/store/app/actions';
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "./socket";
import type { RootState } from "@devmate/store/store";
import { useSocket } from "./context/SocketProvider";
import { privateRoutes } from "./utils/utility";

const { setUserData, setActiveCollabSession } = appActions

export default function PageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const dispatch = useDispatch()
    const socket = useSocket()
    const router = useRouter()
    const params = useParams();
    const collabSessionId = params?.sessionId ?? null;
    const activeCollabSession = useSelector((state: RootState) => state.app.activeCollabSession);
    const socketData = useSelector((state: RootState) => state.app.socketData);
    const userData = useSelector((state: RootState) => state.app.userData);

    useEffect(() => {
        if (session) {
            dispatch(setUserData(session.user as UserResponseDTO))
        } else {
            dispatch(setUserData({ id: "", name: "", email: "", image: "" }))
        }
    }, [session, dispatch])

    useEffect(() => {
        const socket = getSocket();

        return () => {
            socket?.disconnect(); // Clean up connection on unmount
        };
    }, []);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (collabSessionId && activeCollabSession.managerId === socketData.socketId) { // ✅ Only end session if the manager leaves
                sessionStorage.setItem("wasInSession", "true");
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [collabSessionId, socketData]);

    // ✅ After Reload: Check sessionStorage & Redirect
    useEffect(() => {
        if (sessionStorage.getItem("wasInSession")) {
            sessionStorage.removeItem("wasInSession"); // Clear stored data
            router.replace("/workspace"); // Redirect back to normal workspace
        }
    }, []);

    useEffect(() => {
        if (pathname === "/workspace") {
            if (activeCollabSession.sessionId) {
                socket?.emit("end-session", activeCollabSession.sessionId, userData.name);
            }
            dispatch(setActiveCollabSession({
                sessionId: "",
                users: [],
                managerId: "",
                chatMsgs: [],
                isChatBoxOpen: false
            }));
        }
    }, [pathname, dispatch, socket]);

    const isPrivateRoute = privateRoutes.some(route => pathname.includes(route.path));

    return (
        <Flex direction="column" mih="100vh">
            <Box flex="1" display="flex" className="layout-box">
                {!isPrivateRoute && <Header />}
                <Box
                    className="layout-container"
                    flex="1"
                    display="flex"
                    p={0}
                >
                    {children}
                </Box>

                {!isPrivateRoute && <Footer />}
            </Box>
        </Flex>
    );
}
