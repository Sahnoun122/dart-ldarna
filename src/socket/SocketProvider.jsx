import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SocketContext = createContext();

// Utiliser le même port que l'API (5001)
const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:5001";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) {
      // Déconnecter si plus d'utilisateur ou de token
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Créer une nouvelle instance socket
    const newSocket = io(WS_URL, {
      transports: ["websocket", "polling"],
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      auth: {
        token: token
      }
    });

    // Gérer les événements de connexion
    newSocket.on("connect", () => {
      console.log("✅ Socket connecté:", newSocket.id);
      setConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket déconnecté:", reason);
      setConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("🔴 Erreur connexion socket:", error.message);
      console.log("Debug: Token utilisé:", token ? "✅ Présent" : "❌ Manquant");
      console.log("Debug: URL WebSocket:", WS_URL);
      setConnected(false);
    });

    // Gérer les notifications
    newSocket.on("notification:new", (notif) => {
      console.log("🔔 Nouvelle notification:", notif);
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    // Gérer les nouveaux leads
    newSocket.on("lead:new", ({ thread, sysMg }) => {
      console.log("🎯 Nouveau lead:", { thread, sysMg });
      setNotifications((prev) => [
        {
          id: sysMg._id || `lead-${thread._id}`,
          type: "new_lead",
          title: "Nouveau lead",
          message: "Un utilisateur est intéressé par votre propriété",
          payload: { threadId: thread._id },
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setUnreadCount((c) => c + 1);
    });

    // Gérer les erreurs
    newSocket.on("error", (error) => {
      console.error("🔴 Erreur socket:", error);
    });

    // Se connecter
    newSocket.connect();
    setSocket(newSocket);

    // Cleanup à la déconnexion
    return () => {
      newSocket.off();
      newSocket.disconnect();
    };
  }, [user, token]);

  const markAllNotificationsRead = () => {
    if (!socket) return;
    
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    if (ids.length === 0) return;
    
    socket.emit("notification:read", { notificationIds: ids }, (ack) => {
      if (ack?.status === "ok") {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        console.log("✅ Notifications marquées comme lues");
      }
    });
  };

  const joinThread = (threadId) => {
    if (!socket || !threadId) return;
    
    console.log('🏠 Rejoindre room:', threadId);
    socket.emit('join-room', { threadId });
  };

  const sendMessage = (threadId, message, recipientId) => {
    if (!socket || !threadId || !message) return;
    
    console.log('📤 Envoi message simple:', { threadId, message });
    socket.emit('send-message', {
      threadId,
      message: message.trim(),
      recipientId
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
        markAllNotificationsRead,
        joinThread,
        sendMessage,
        user,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
