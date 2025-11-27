import React, { useState } from "react";

export default function MessageInput({ onSend, disabled = false, placeholder = "Écrire un message..." }) {
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    const submit = async () => {
        if (!text.trim() || sending || disabled) return;

        setSending(true);
        try {
            await onSend(text);
            setText(""); // Vider le champ après envoi réussi
        } catch (error) {
            console.error("Erreur lors de l'envoi:", error);
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className="flex gap-2">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                disabled={sending || disabled}
            />

            <button
                onClick={submit}
                disabled={!text.trim() || sending || disabled}
                className={`px-6 py-3 rounded-lg font-medium ${
                    !text.trim() || sending || disabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
                {sending ? (
                    <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Envoi...
                    </div>
                ) : (
                    'Envoyer'
                )}
            </button>
        </div>
    );
}