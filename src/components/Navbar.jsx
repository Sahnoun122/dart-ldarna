import React from "react";
import { Link } from "react-router-dom";
import NotificationsCenter from "./NotificationsCenter";
import { useSocket } from "../socket/SocketProvider";

export default function Navbar() {
  const { unreadCount } = useSocket();

  return (
    <nav className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">
        DARNA
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/annonces" className="text-gray-700">
          Annonces
        </Link>
        <NotificationsCenter />
        <div className="text-sm text-red-600 font-semibold">
          {unreadCount > 0 ? unreadCount : null}
        </div>
      </div>
    </nav>
  );
}
