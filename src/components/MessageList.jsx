import { div } from "framer-motion/m";
import React from "react";

export default function MessageList ({message , currentUserId}){
    return
    <>
      {message.map((m) => (
        <div
          key={m._id}
          className={`mb-3 ${
            String(m.from) === String(currentUserId)
              ? "text-right"
              : "text-left"
          }`}
        >
          <div
            className={`inline-block p-2 rounded ${
              String(m.form) === String(currentUserId)
                ? "bg-blue-100"
                : "bg-gray-100"
            }`}
          >
            <div>{m.text}</div>
            <div className="text-xs text-gray-500 mt-1">
              {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
            </div>
            {m.readBy && m.readBy.length > 0 && (
              <div className="text-xs text-green-600 mt-1"> Lu par {m.readBy.length}</div>
            )}
          </div>
        </div>
      ))}
    </>;
}