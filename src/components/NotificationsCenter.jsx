import React, { useState } from "react";
import { useSocket } from "../socket/SocketProvider";

export default function NotificationsCenter() {
  const { notifications, markAllNotificationsRead, socket } = useSocket();
  const [open, setOpen] = useState(false);

  const handleMarkAll = () => {
    markAllNotificationsRead();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="p-2 rounded hover:bg-gray-100"
      >
        🔔
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow p-3">
          <div className="flex justify-between items-center mb-2">
            <strong>Notifications</strong>
            <button onClick={handleMarkAll} className="text-sm text-blue-600">
              Tout marquer lu
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="text-sm text-gray-500">Aucune notification</p>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 mb-2 rounded ${
                  n.read ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-gray-600">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
