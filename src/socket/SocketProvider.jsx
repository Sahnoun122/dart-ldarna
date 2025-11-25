import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const SocketContext = createContext();
export const socket = io("http://localhost:8001", { autoConnect: false });

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, token } = useAuth();

  useEffect(() => {
    if (!user || !token) return;

    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("notifications:new", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((c) => c + 1);
    });

    socket.on("lead:new", ({ thread, sysMg }) => {
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

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [user, token]);

  const markAllNotificationsRead = () => {
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    if (ids.length === 0) return;
    socket.emit("notifications:read", { notificationIds: ids }, (ack) => {
      if (ack?.status === "ok") {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
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
        user, 
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
