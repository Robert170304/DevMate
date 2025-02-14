import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { initializeSocket, disconnectSocket } from "@devmate/app/socket";
import type { RootState } from "@devmate/store/store";
import type { Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const userData = useSelector((state: RootState) => state.app.userData);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (userData?.id) {
            const newSocket = initializeSocket();
            setSocket(newSocket);
        } else {
            disconnectSocket();
            setSocket(null);
        }
    }, [userData?.id]);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
