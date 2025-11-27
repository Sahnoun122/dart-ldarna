import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { getThreadMessages, sendMessage } from '../services/thread.api';
import { useAuth } from '../context/AuthContext';

function ChatWindowSimple({ conversation, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Charger les messages
  useEffect(() => {
    if (!conversation?._id) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const response = await getThreadMessages(conversation._id);
        const messagesData = Array.isArray(response) ? response : [];
        setMessages(messagesData);
      } catch (error) {
        console.error('Erreur chargement messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [conversation?._id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Envoyer message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const tempMessage = {
      _id: 'temp-' + Date.now(),
      text: newMessage.trim(),
      content: newMessage.trim(),
      from: { 
        _id: currentUserId, 
        name: user?.name || 'Moi' 
      },
      createdAt: new Date().toISOString(),
      isOwn: true
    };

    setMessages(prev => [...prev, tempMessage]);
    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      const response = await sendMessage(conversation._id, messageContent);
      setMessages(prev => prev.map(msg => 
        msg._id === tempMessage._id ? response : msg
      ));
    } catch (error) {
      console.error('Erreur envoi:', error);
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
      setNewMessage(messageContent);
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    } finally {
      setSending(false);
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <div className="text-lg font-medium">Sélectionnez une conversation</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            {conversation.otherParticipant?.name?.[0]?.toUpperCase() || '👤'}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {conversation.otherParticipant?.name || 'Utilisateur'}
            </h3>
            <p className="text-sm text-gray-500">
              {conversation.otherParticipant?.email || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <div>Aucun message pour l'instant</div>
          </div>
        ) : (
          messages.map((message) => {
            // Déterminer l'ID de l'expéditeur
            let messageFromId = '';
            if (message.from) {
              if (typeof message.from === 'string') {
                messageFromId = message.from;
              } else if (message.from._id) {
                messageFromId = message.from._id;
              } else if (message.from.id) {
                messageFromId = message.from.id;
              }
            }
            
            const isOwn = String(messageFromId) === String(currentUserId);
            const isTemp = message._id?.toString().startsWith('temp-');
            
            return (
              <div
                key={message._id}
                className={`flex ${(isOwn || isTemp || message.isOwn) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    (isOwn || isTemp || message.isOwn)
                      ? `bg-blue-500 text-white ${isTemp ? 'opacity-70' : ''}`
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {!(isOwn || isTemp || message.isOwn) && (
                    <div className="text-xs mb-1 opacity-75">
                      {message.from?.name || message.from?.email || 'Autre'}
                    </div>
                  )}
                  <div>{message.text || message.content || '[Message vide]'}</div>
                  <div className={`text-xs mt-1 opacity-75`}>
                    {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tapez votre message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindowSimple;