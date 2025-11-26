import { io } from "socket.io-client"

// Utiliser le même port que l'API (5001) car WebSocket et HTTP sont sur le même serveur
const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:5001";

export const socket = io(WS_URL, {
    transports: ["websocket", "polling"], // Permettre fallback sur polling si websocket échoue
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000,
});