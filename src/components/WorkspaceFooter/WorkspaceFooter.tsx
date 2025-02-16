import { Box, Button, Flex, Menu, Text, Tooltip } from '@mantine/core'
import React, { useState } from 'react'
import "./WorkspaceFooter.scss"
import { copyToClipBoard, generateUUID, getLanguageFromExtension, showNotification, updateFileTreeContent } from '@devmate/app/utils/commonFunctions';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@devmate/store/store';
import appActions from '@devmate/store/app/actions';
import { useSocket } from '@devmate/app/context/SocketProvider';
import Image from 'next/image';
import { IconMessage, IconPlaystationCircle, IconUserPlus, IconLogout } from '@tabler/icons-react';
import { apiHelper } from '@devmate/app/helpers/apiHelper';
import { signOut } from 'next-auth/react';

const {
    setUserData,
    setActiveCollabSession,
    setIsAIChatBox,
    setIsTerminalOpen,
    setCurrentFileData,
    setAllOpenFiles,
    setFileTreeData
} = appActions

const WorkspaceFooter = () => {
    const socket = useSocket()
    const router = useRouter()
    const dispatch = useDispatch()
    const [actionLoaderName, setActionLoaderName] = useState<string>("");
    const AIChatBox = useSelector((state: RootState) => state.app.isAIChatBoxOpen);
    const activeCollabSession = useSelector((state: RootState) => state.app.activeCollabSession);
    const currentFileData = useSelector((state: RootState) => state.app.currentFileData);
    const socketData = useSelector((state: RootState) => state.app.socketData);
    const userData = useSelector((state: RootState) => state.app.userData);
    const fileTreeData = useSelector((state: RootState) => state.app.fileTreeData);
    const allOpenFiles = useSelector((state: RootState) => state.app.allOpenFiles);


    const footerLeftActions = [
        { label: "DevMate AI", id: "devmate-ai", action: () => handleAction("devmate-ai") },
        { label: "Improve Code", id: "improve-code", action: () => handleAction("improve-code") },
    ]

    const footerRightActions = [
        { label: "Share Code Link", id: "share-code-link", action: () => handleAction("share-code-link") },
        { label: "Output Panel", id: "output-panel", action: () => handleAction("output-panel") },
        { label: "Invite to Collaborate", id: "invite-to-collaborate", action: () => handleAction("invite-to-collaborate") },
        {
            label: <Tooltip label="Logout" withArrow>
                <IconLogout size={18} />
            </Tooltip>,
            id: "logout-workspace",
            action: () => handleAction("logout-workspace")
        }
    ]

    const improveCode = async () => {
        setActionLoaderName("improve-code")
        try {
            const data = await apiHelper('/api/ai-improve-code', 'POST', {
                code: currentFileData.content,
                language: getLanguageFromExtension(currentFileData?.name || " "),
            }) as { improvedCode: string };
            if (data.improvedCode) {
                const updatedCurrentFile = { ...currentFileData, content: data.improvedCode };
                dispatch(setCurrentFileData(updatedCurrentFile))

                // Update allOpenFiles
                const updatedOpenFiles = allOpenFiles.map((file) =>
                    file.id === currentFileData.id ? updatedCurrentFile : file
                );
                dispatch(setAllOpenFiles(updatedOpenFiles));

                // Update fileTreeData
                if (fileTreeData) {
                    const updatedFileTreeData = updateFileTreeContent(fileTreeData, currentFileData.id, data.improvedCode ?? "");
                    dispatch(setFileTreeData(updatedFileTreeData));
                }
            }
        } catch (error) {
            console.log("🚀 ~ improveCode ~ error:", error)
            showNotification({ title: "Error", message: "Something went wrong!" })
        } finally {
            setActionLoaderName("")
        }
    };

    const handleAction = (actionId: string) => {
        switch (actionId) {
            case "devmate-ai":
                dispatch(setActiveCollabSession({ ...activeCollabSession, isChatBoxOpen: false }))
                dispatch(setIsAIChatBox({ ...AIChatBox, open: true }))
                break;
            case "improve-code": {
                improveCode()
                break;
            }
            case "share-code-link": {
                const encodedCode = encodeURIComponent(btoa(decodeURIComponent(encodeURIComponent(currentFileData?.content ?? "")))); // Encode safely
                const encodedLang = encodeURIComponent(getLanguageFromExtension(currentFileData?.name || " "));
                const shareableLink = `${window.location.origin}/share?code=${encodedCode}&lang=${encodedLang}`;
                copyToClipBoard(shareableLink, true, "Share link copied!");
                break;
            }
            case "output-panel":
                dispatch(setActiveCollabSession({ ...activeCollabSession, isChatBoxOpen: false }))
                dispatch(setIsAIChatBox({ ...AIChatBox, open: false }))
                dispatch(setIsTerminalOpen(true));
                break;
            case "invite-to-collaborate":
                createInviteeSession()
                break;
            case "logout-workspace":
                handleSignOut()
                break;
            default:
                break;
        }
    }

    const createInviteeSession = () => {
        setActionLoaderName("invite-to-collaborate")
        const newSessionId = generateUUID(); // Generate unique session ID
        // setInviteesSessionId(newSessionId);
        copyToClipBoard(`${window.location.origin}/workspace/${newSessionId}`, true, "Invite link copied!")
        dispatch(setActiveCollabSession({ sessionId: newSessionId, users: [], managerId: socketData.socketId, chatMsgs: [], isChatBoxOpen: false }));
        router.push(`/workspace/${newSessionId}`)
        setTimeout(() => {
            setActionLoaderName("")
        }, 200)
    };

    const handleSignOut = () => {
        setActionLoaderName("logout-workspace")
        signOut()
        dispatch(setUserData({ id: "", name: "", email: "", image: "" }))
        setTimeout(() => {
            setActionLoaderName("")
        }, 200)
    };

    return (
        <Box p="0px 10px" h="22px" className='workspace-footer_container' >
            <Box className='footer-left_section' >
                <Text fz="sm" mr="sm" fw="bold" >DevMate</Text>
                {footerLeftActions.map((item) => (
                    <Button
                        variant="default"
                        key={item.id}
                        fw="500"
                        p="0 10px"
                        h="inherit"
                        onClick={item.action}
                        disabled={actionLoaderName === item.id}
                        loading={actionLoaderName === item.id}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
            <Box className='footer-right_section' >
                {footerRightActions.map((item) => {
                    if (item.id === "invite-to-collaborate" && activeCollabSession?.sessionId) {
                        return (
                            <Menu key={item.id} shadow="md" width={200}>
                                <Menu.Target>
                                    <Button
                                        variant="default"
                                        key={item.id}
                                        fw="500"
                                        p="0 10px"
                                        h="inherit"
                                        disabled={actionLoaderName === item.id}
                                        loading={actionLoaderName === item.id}
                                    >
                                        <IconPlaystationCircle size={15} style={{ marginRight: "5px" }} />
                                        Active Collab Session
                                    </Button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>Users</Menu.Label>
                                    {activeCollabSession.users.map((user) => (
                                        <Menu.Item key={user.id} >
                                            <div className='user-info-container'>
                                                <Image
                                                    src={`https://robohash.org/${user.username}`}
                                                    alt={user.username ?? 'User Image'}
                                                    width={20}
                                                    height={20}
                                                    blurDataURL={`https://robohash.org/${user.username}`}
                                                />
                                                <span>{user?.username}</span>
                                                {user?.id === socketData.socketId && <span> (You)</span>}
                                            </div>
                                        </Menu.Item>
                                    ))}
                                    <Menu.Divider />
                                    <Menu.Item onClick={() => copyToClipBoard(`${window.location.origin}/workspace/${activeCollabSession.sessionId}`, true, "Invite link copied!")} >
                                        <Flex gap={7} >
                                            <IconUserPlus size={20} />
                                            <Text fz="13px" >Invite User</Text>
                                        </Flex>
                                    </Menu.Item>
                                    <Menu.Item onClick={() => {
                                        dispatch(setActiveCollabSession({ ...activeCollabSession, isChatBoxOpen: true }))
                                        dispatch(setIsAIChatBox({ ...AIChatBox, open: false }))
                                    }} >
                                        <Flex gap={7} >
                                            <IconMessage size={20} />
                                            <Text fz="13px" >Group Chat</Text>
                                        </Flex>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item onClick={() => {
                                        socket?.emit("end-session", activeCollabSession.sessionId, userData.name);
                                        dispatch(setActiveCollabSession({ sessionId: "", users: [], managerId: "", chatMsgs: [], isChatBoxOpen: false }));
                                        router.replace(`/workspace`)
                                    }} >
                                        <Text fz="13px" >End Collab Session</Text>
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        )
                    }
                    return (
                        <Button
                            variant="default"
                            key={item.id}
                            fw="500"
                            p="0 10px"
                            h="inherit"
                            onClick={item.action}
                            disabled={actionLoaderName === item.id}
                            loading={actionLoaderName === item.id}
                        >
                            {item.label}
                        </Button>
                    )
                })}
            </Box>
        </Box >
    )
}

export default WorkspaceFooter