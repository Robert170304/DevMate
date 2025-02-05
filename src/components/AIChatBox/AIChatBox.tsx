import React, { useEffect, useRef, useState } from "react";
import { ActionIcon, Box, Image, Text, Textarea, Tooltip } from "@mantine/core";
import "./AIChatBox.scss";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@devmate/store/store";
import { apiHelper } from "@devmate/app/helpers/apiHelper";
import { IconMessage2Plus, IconSend2, IconX } from "@tabler/icons-react";
import MarkdownRenderer from "../MarkDownRenderer/MarkDownRenderer";
import { copyToClipBoard, detectCode, generateMessageId, preprocessMDContent } from "@devmate/app/utils/commonFunctions";
import appActions from "@devmate/store/app/actions";
import { debounce } from "lodash";
import { useContextMenu } from "react-contexify";
import ContextMenu from "../ContextMenu/ContextMenu";

const { setIsAIChatBox } = appActions
const MESSAGE_CONTEXT_MENU_ID = "message-context-menu"
const AIChatBox: React.FC = () => {
    const AIChatBox = useSelector((state: RootState) => state.app.isAIChatBoxOpen);
    const dispatch = useDispatch()
    const [chatMsgs, setChatMsgs] = useState<{ id: string; user: string; text: string; isCode?: boolean; isGenerating?: boolean }[]>(AIChatBox.messages);
    console.log("🚀 ~ chatMsgs:", chatMsgs)
    const [contextMenuMsgId, setContextMenuMsgId] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const userData = useSelector((state: RootState) => state.app.userData);
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
        {
            id: 'new_chat',
            label: 'New Chat',
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

        setChatMsgs((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        const formattedMessages = [...chatMsgs, userMessage].map((msg) => ({
            role: msg.user === "You" ? "user" : "assistant",
            content: msg.text,
        }));
        setTimeout(() => {
            setChatMsgs((prev) => [...prev, { id: generateMessageId(), user: "AI", text: "Generating...", isGenerating: true }]);
        }, 200)
        console.log("🚀 ~ formattedMessages ~ formattedMessages:", formattedMessages)

        try {
            const data = await apiHelper("/api/ai-chat", "POST",
                { messages: formattedMessages }
            ) as { response: string };

            if (data.response) {
                setChatMsgs((prev) =>
                    prev.map((msg) =>
                        msg.isGenerating ? { id: msg.id, user: "AI", text: data.response, isCode: detectCode(data.response) } : msg
                    )
                );
            } else {
                setChatMsgs((prev) =>
                    prev.map((msg) =>
                        msg.isGenerating ? { id: msg.id, user: "AI", text: "Something went wrong while generating response." } : msg
                    )
                );
            }
        } catch (error) {
            console.error("Chat API Error:", error);
            setChatMsgs((prev) =>
                prev.map((msg) =>
                    msg.isGenerating ? { id: msg.id, user: "AI", text: "Failed to get a response from AI." } : msg
                )
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("🚀 ~ chatMsgs:", chatMsgs)
        dispatch(setIsAIChatBox({ ...AIChatBox, messages: chatMsgs }))
        scrollToBottom();
        setTimeout(() => {
            console.log("🚀 ~ AIChatBox:", AIChatBox, AIChatBox.messages)
        }, 1000)
    }, [chatMsgs]); // Scroll to the bottom whenever messages change

    useEffect(() => {
        const debouncedEffect = debounce(() => {
            console.log("🚀 ~ useEffect ~ AIChatBox:", AIChatBox)
            if (AIChatBox.isExplainCode) {
                handleSend({
                    id: generateMessageId(),
                    user: "You",
                    text: AIChatBox.explainCodeContent,
                    isCode: true
                });
                dispatch(setIsAIChatBox({
                    ...AIChatBox,
                    isExplainCode: false,
                    explainCodeContent: "",
                    messages: chatMsgs,
                    isModifyCode: false,
                    modifyCodeContent: ""
                }))
            }
        }, 300);
        debouncedEffect();
        return () => {
            debouncedEffect.cancel();
        };
    }, [AIChatBox?.isExplainCode]);

    useEffect(() => {
        const debouncedEffect = debounce(() => {
            console.log("🚀 ~ useEffect ~ AIChatBox:", AIChatBox)
            if (AIChatBox.isModifyCode) {
                handleSend({
                    id: generateMessageId(),
                    user: "You",
                    text: AIChatBox.modifyCodeContent,
                    isCode: true
                });
                dispatch(setIsAIChatBox({
                    ...AIChatBox,
                    isExplainCode: false,
                    explainCodeContent: "",
                    messages: chatMsgs,
                    isModifyCode: false,
                    modifyCodeContent: ""
                }))
            }
        }, 300);
        debouncedEffect();
        return () => {
            debouncedEffect.cancel();
        };
    }, [AIChatBox?.isModifyCode]);

    return (
        <Box className="chatbox-container">
            <Box className="chatbox_header">
                <Box className="chatbox-header_left" >
                    <div className="ai-chat-logo_container">
                        <Image src="/app-logo.jpeg" alt="devmate logo" width={25} height={25} />
                    </div>
                    <Text fs="14px">DevMate AI</Text>
                </Box>
                <Box className="chatbox-header_right">
                    <Tooltip label="New Chat" withArrow>
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => {
                                setChatMsgs([])
                                dispatch(setIsAIChatBox({ ...AIChatBox, isExplainCode: false, explainCodeContent: "", isModifyCode: false, modifyCodeContent: "" }))
                            }}
                        >
                            <IconMessage2Plus size={15} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Close" withArrow>
                        <ActionIcon variant="subtle" color="gray" onClick={() => {
                            dispatch(setIsAIChatBox({
                                ...AIChatBox, open: false, isExplainCode: false, explainCodeContent: "", isModifyCode: false, modifyCodeContent: ""
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
                                        src={message.user === "AI" ? "/app-logo.jpeg" : userData.image}
                                        alt="user-avatar"
                                        width={20}
                                        height={20}
                                        radius="50%"
                                    />
                                </div>
                                <Text className="chatbox-user" fs="12px" fw={600}>
                                    {message.user === "AI" ? "DevMate AI" : userData.name}
                                </Text>
                            </Box>
                            <Box className="msg-text_box">
                                {(() => {
                                    if (message.isGenerating) {
                                        return (
                                            <Text className="chatbox-user-msg generating-text" fs="14px">
                                                Generating...
                                            </Text>
                                        );
                                    } else if (message.isCode) {
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
                                            <Text onContextMenu={(e) => handleMsgContextMenu(e, message.id)} className="chatbox-user-msg" fs="14px">
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
                    onChange={(e) => setInput(e.target.value)}
                    className="chatbox-input"
                    disabled={loading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            if (!input.trim()) return;
                            // If it's only Enter (not Shift + Enter), send the message
                            handleSend({
                                id: generateMessageId(),
                                user: "You",
                                text: input,
                                isCode: detectCode(input)
                            });
                            e.preventDefault(); // Prevent the default Enter behavior (e.g., form submission)
                        }
                    }}
                    placeholder="Message DevMate AI"
                />
                <ActionIcon
                    variant="light"
                    onClick={() => {
                        if (!input.trim()) return;
                        handleSend({
                            id: generateMessageId(),
                            user: "You",
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

export default AIChatBox;
