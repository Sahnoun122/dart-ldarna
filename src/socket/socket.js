import { io } from "socket.io-client"

const WS_URL = import.meta.env.VITE_WS_URL || "https://localhost:8001";

export const socket = io(WS_URL,{
    transports : ["websocket"],
    autoConnect : false,
});