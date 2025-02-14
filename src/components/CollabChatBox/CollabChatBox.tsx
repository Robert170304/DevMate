import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActionIcon, Box, Image, Text, Textarea, Tooltip } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@devmate/store/store";
import { IconSend2, IconX } from "@tabler/icons-react";
import MarkdownRenderer from "../MarkDownRenderer/MarkDownRenderer";
import { copyToClipBoard, detectCode, generateMessageId, preprocessMDContent } from "@devmate/app/utils/commonFunctions";
import appActions from "@devmate/store/app/actions";
import { useContextMenu } from "react-contexify";
import ContextMenu from "../ContextMenu/ContextMenu";
import "./CollabChatBox.scss";
import { useSocket } from "@devmate/app/context/SocketProvider";

const { setActiveCollabSession } = appActions
const MESSAGE_CONTEXT_MENU_ID = "collab-message-context-menu"
const CollabChatBox: React.FC = () => {
    const activeCollabSession = useSelector((state: RootState) => state.app.activeCollabSession);
    const socket = useSocket()
    const dispatch = useDispatch()
    const [chatMsgs, setChatMsgs] = useState<{ id: string; user: string; text: string; isCode: boolean; }[]>(activeCollabSession.chatMsgs);
    const userData = useSelector((state: RootState) => state.app.userData);
    const [contextMenuMsgId, setContextMenuMsgId] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messageContextMenuItems = [
        {
            id: 'copy_msg',
            label: 'Copy Message',
            action: () => {
                const findMsg = chatMsgs.find((msg) => msg.id === contextMenuMsgId)
                if (findMsg) {
                    copyToClipBoard(findMsg.text)
                    setContextMenuMsgId("")
                }
            }
        },
        {
            id: 'clear_chat',
            label: 'Clear Chat',
            action: () => {
                setChatMsgs([]);
            }
        },
    ]
    const { show } = useContextMenu({
        id: MESSAGE_CONTEXT_MENU_ID,
    });


    const handleMsgContextMenu = (event: React.MouseEvent, msgId: string) => {
        setContextMenuMsgId(msgId)
        show({
            event,
        })
    }

    // Scroll to the bottom whenever a new message is added
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleSend = async (userMessage: { id: string, user: string, text: string, isCode: boolean }) => {
        setLoading(true)
        setChatMsgs((prev) => [...prev, userMessage]);
        setInput("");
        socket?.emit("send-group-message", userMessage)
        setLoading(false)
    };

    useEffect(() => {
        dispatch(setActiveCollabSession({ ...activeCollabSession, chatMsgs }))
        scrollToBottom();
    }, [chatMsgs]); // Scroll to the bottom whenever messages change

    useEffect(() => {
        const handleReceiveMessage = (message: { id: string, user: string, text: string, isCode: boolean }) => {
            setChatMsgs((prev) => [...prev, message]);
        };

        socket?.on("receive-group-message", handleReceiveMessage);

        return () => {
            socket?.off("receive-group-message", handleReceiveMessage); // Cleanup on unmount
        };
    }, [socket]); // Runs only when socket changes


    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    }, []);


    return (
        <Box className="chatbox-container">
            <Box className="chatbox_header">
                <Box className="chatbox-header_left" >
                    <div className="ai-chat-logo_container">
                        <Image src="/app-logo.jpeg" alt="devmate logo" width={25} height={25} />
                    </div>
                    <Text>Chat</Text>
                </Box>
                <Box className="chatbox-header_right">
                    <Tooltip label="Close" withArrow>
                        <ActionIcon variant="subtle" color="gray" onClick={() => {
                            dispatch(setActiveCollabSession({
                                ...activeCollabSession, isChatBoxOpen: false
                            }))
                        }} >
                            <IconX size={15} />
                        </ActionIcon>
                    </Tooltip>
                </Box>
            </Box>
            <Box className="chatbox-messages" onContextMenu={(e) => e.preventDefault()} >
                <Box className="chatbox-messages_scrollarea">
                    {chatMsgs.map((message) => (
                        <Box key={message.id} className="chatbox-message">
                            <Box className="user-name_box">
                                <div className="msg-user-img_container">
                                    <Image
                                        src={`https://robohash.org/${message.user}`}
                                        alt={message.user ?? 'User Image'}
                                        width={20}
                                        height={20}
                                        radius="50%"
                                    />
                                </div>
                                <Text className="chatbox-user" fw={600}>
                                    {message.user}
                                </Text>
                            </Box>
                            <Box className="msg-text_box">
                                {(() => {
                                    if (message.isCode) {
                                        return (
                                            <div
                                                className="markdown-container"
                                                title="markdown_code_msg"
                                                role="button"
                                                tabIndex={0}
                                                onContextMenu={(e) => handleMsgContextMenu(e, message.id)}
                                                onKeyDown={(e) => {
                                                    e.preventDefault()
                                                }}
                                            >
                                                <MarkdownRenderer content={preprocessMDContent(message.text)} />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <Text onContextMenu={(e) => handleMsgContextMenu(e, message.id)} className="chatbox-user-msg">
                                                {message.text}
                                            </Text>
                                        );
                                    }
                                })()}
                            </Box>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>
            </Box>
            <Box className="chatbox-input-container">
                <Textarea
                    minRows={3} // Default height
                    maxRows={7} // Limits expansion (7 rows)
                    autosize
                    value={input}
                    onChange={(e) => handleInputChange(e)}
                    className="chatbox-input"
                    disabled={loading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            if (!input.trim()) return;
                            // If it's only Enter (not Shift + Enter), send the message
                            handleSend({
                                id: generateMessageId(),
                                user: userData.name,
                                text: input,
                                isCode: detectCode(input)
                            });
                            e.preventDefault(); // Prevent the default Enter behavior (e.g., form submission)
                        }
                    }}
                    placeholder="Message"
                />
                <ActionIcon
                    variant="light"
                    onClick={() => {
                        if (!input.trim()) return;
                        handleSend({
                            id: generateMessageId(),
                            user: userData.name,
                            text: input,
                            isCode: detectCode(input)
                        });
                    }}
                    pos="absolute"
                    right="20px"
                    bottom="20px"
                    className="chatbox-send-button"
                    disabled={loading}
                >
                    <IconSend2 size={20} />
                </ActionIcon>
            </Box>
            <ContextMenu items={messageContextMenuItems} menuId={MESSAGE_CONTEXT_MENU_ID} />
        </Box>
    );
};

export default CollabChatBox;
