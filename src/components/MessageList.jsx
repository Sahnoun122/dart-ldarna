import React from "react";

export default function MessageList({ messages = [], currentUserId }) {
    if (!messages.length) {
        return (
            <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-2">💬</div>
                <p>Aucun message pour le moment</p>
                <p className="text-sm">Commencez la conversation !</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {messages.map((message, index) => {
                const isFromCurrentUser = String(message.from) === String(currentUserId);
                const showTimestamp = message.createdAt;
                
                return (
                    <div
                        key={message._id || index}
                        className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg break-words ${
                                isFromCurrentUser
                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                            }`}
                        >
                            <div className="whitespace-pre-wrap">{message.text}</div>
                            {showTimestamp && (
                                <div className={`text-xs mt-1 ${
                                    isFromCurrentUser ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                    {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            )}
                            {message.readBy && message.readBy.length > 0 && isFromCurrentUser && (
                                <div className="text-xs text-blue-100 mt-1">
                                    ✓ Lu
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}