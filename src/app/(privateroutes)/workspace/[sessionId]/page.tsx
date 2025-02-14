"use client";
import EditorView from '@devmate/components/EditorView/EditorView';
import Explorer from '@devmate/components/Explorer/Explorer';
import { Box } from '@mantine/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';
import DevMateTerminal from '@devmate/components/DevMateTerminal/DevMateTerminal';
import AIChatBox from '@devmate/components/AIChatBox/AIChatBox';
import WorkspaceFooter from '@devmate/components/WorkspaceFooter/WorkspaceFooter';
import "@devmate/app/(privateroutes)/workspace/workspace.scss"
import { useParams, useRouter } from 'next/navigation';
import { debounce, uniqBy } from 'lodash';
import appActions from '@devmate/store/app/actions';
import { useSocket } from '@devmate/app/context/SocketProvider';
import { showNotification } from '@devmate/app/utils/commonFunctions';
import CollabChatBox from '@devmate/components/CollabChatBox/CollabChatBox';

const { setActiveCollabSession } = appActions
const Workspace = () => {
    const socket = useSocket();
    const params = useParams(); // 🔥 Unwrap params using React.use()
    const dispatch = useDispatch()
    const router = useRouter()
    const sessionId = params?.sessionId ?? null; // Extract session ID from URL
    const isTerminalPanelOpen = useSelector((state: RootState) => state.app.isTerminalPanelOpen);
    const isAIChatBox = useSelector((state: RootState) => state.app.isAIChatBoxOpen);
    const fileTreeData = useSelector((state: RootState) => state.app.fileTreeData);
    const userData = useSelector((state: RootState) => state.app.userData);
    const activeCollabSession = useSelector((state: RootState) => state.app.activeCollabSession);
    const socketData = useSelector((state: RootState) => state.app.socketData);

    useEffect(() => {
        const debouncedJoinSession = debounce(() => {
            if (sessionId && userData.id && (activeCollabSession.managerId ? activeCollabSession.managerId === socketData.socketId : true)) {
                socket?.emit("join-session", { sessionId, username: userData.name, managerId: activeCollabSession.managerId });
                if (!activeCollabSession.sessionId) {
                    dispatch(setActiveCollabSession({ ...activeCollabSession, sessionId: (sessionId || "") as string }));
                }
            }
        }, 200);
        debouncedJoinSession();
        return () => {
            debouncedJoinSession.cancel();
        };
    }, [sessionId, userData, socket]);

    useEffect(() => {
        const debouncedSessionUpdate = debounce((data) => {
            dispatch(setActiveCollabSession({
                ...activeCollabSession,
                users: uniqBy(data.users, (user: { id: string, username: string }) => user.id)
            }));

            if (data?.joinedUser && data?.joinedUser.id !== socketData.socketId) {
                showNotification({
                    title: "User Joined",
                    message: `${data.joinedUser.username} joined the session.`,
                    color: "blue",
                });
            }

            if (data?.leftUser && data?.leftUser.id !== socketData.socketId) {
                showNotification({
                    title: "User Left",
                    message: `${data.leftUser.username} left the session.`,
                    color: "red",
                });
            }

            if (data?.joinedUser &&
                data?.joinedUser.id !== activeCollabSession.managerId &&
                data?.joinedUser.id !== socketData.socketId &&
                activeCollabSession.managerId &&
                activeCollabSession.managerId === socketData.socketId) {
                socket?.emit("update-fileTree", fileTreeData);
            }
            if (data?.leftUser &&
                data?.leftUser.id !== activeCollabSession.managerId &&
                data?.leftUser.id !== socketData.socketId &&
                activeCollabSession.managerId &&
                activeCollabSession.managerId === socketData.socketId) {
                socket?.emit("update-fileTree", []);
            }
        }, 1000);

        socket?.on("session-update", debouncedSessionUpdate);

        const debouncedSessionEnded = debounce((data) => {
            dispatch(setActiveCollabSession({ sessionId: "", users: [], managerId: "", chatMsgs: [], isChatBoxOpen: false }));
            showNotification({ title: "", message: data.message })
            router.replace("/workspace")
        }, 1000);

        socket?.on("session-ended", debouncedSessionEnded);

        return () => {
            debouncedSessionUpdate.cancel();
            debouncedSessionEnded.cancel()
            socket?.off("session-update")
            socket?.off("session-ended")
        };
    }, [socket, socketData]);


    return (
        <Box className="workspace-container">
            {/* <Box className='workspace-header' >
                <WorkspaceHeader />
            </Box> */}
            <Box className='workspace-content' >
                <Box className="explorer">
                    <Explorer />
                </Box>
                <Box className="editor-view-box">
                    <EditorView />
                </Box>
                {isAIChatBox.open && <Box className='chat_view' >
                    <AIChatBox />
                </Box>}
                {activeCollabSession.isChatBoxOpen && <Box className='chat_view' >
                    <CollabChatBox />
                </Box>}
                {isTerminalPanelOpen && <Box className="terminal-section">
                    <DevMateTerminal />
                </Box>
                }
            </Box>
            <Box className='workspace-footer' >
                <WorkspaceFooter />
            </Box>
        </Box>
    );
};

export default Workspace;
