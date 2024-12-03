import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();
const { REACT_APP_API_HOST } = process.env
// Custom hook to use socket
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const URL = REACT_APP_API_HOST;
    useEffect(() => {

        const newSocket = io(URL);  // Make sure this matches your backend URL
        setSocket(newSocket);

        // Cleanup on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);  // Empty dependency array ensures this only runs once (on mount)

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
