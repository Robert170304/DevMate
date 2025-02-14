// socket.ts
import { io, Socket } from "socket.io-client";
import { store } from "@devmate/store/store";
import appActions from "@devmate/store/app/actions";
import { showNotification } from "./utils/commonFunctions";

const { setSocketData, setActiveCollabSession } = appActions

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3001";
console.log("🚀 ~ process.env.NEXT_PUBLIC_SOCKET_URL:", process.env.NEXT_PUBLIC_SOCKET_URL)

let socket: Socket | null = null;

export const initializeSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ["websocket"],
            reconnectionAttempts: 5, // Retry 5 times if fails
            reconnectionDelay: 2000, // Wait 2 sec before reconnecting
        });

        socket.on("connect", () => {
            console.log("✅ Connected to WebSocket server!", socket?.id);
            store.dispatch(setSocketData({ socketId: socket?.id ?? "" }));
            const activeCollabSession = store.getState().app.activeCollabSession
            if (activeCollabSession.managerId) {
                store.dispatch(setActiveCollabSession({
                    ...activeCollabSession,
                    managerId: socket?.id ?? ""
                }));
            }
        });

        socket.on("receive-group-message", (message) => {
            const activeCollabSession = store.getState().app.activeCollabSession
            store.dispatch(setActiveCollabSession({
                ...activeCollabSession,
                chatMsgs: [...activeCollabSession.chatMsgs, message]
            }));
            if (!activeCollabSession.isChatBoxOpen) {
                showNotification({ title: message.user, message: message.text })
            }
        });

        socket.on("connect_error", (err) => {
            console.error("⚠️ Connection Error:", err);
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected from WebSocket server");
            store.dispatch(setSocketData({ socketId: "" }));
        });
    }
    return socket;
};

export const getSocket = (): Socket | null => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
