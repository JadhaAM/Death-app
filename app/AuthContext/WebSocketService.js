// WebSocketService.js
import { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);
const socketUrl = 'ws://localhost:3000';

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(socketUrl);
        setSocket(ws);

        ws.onopen = () => console.log('WebSocket connected');
        
        
        ws.onclose = () => console.log('WebSocket disconnected');

        return () => ws.close();
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};