import React, { useState, useEffect } from 'react';
import { sendMessageREST } from '../services/message.api';
import { addMessageSafely, formatMessageForDisplay } from '../utils/messageUtils';
import { useSocket } from '../socket/SocketProvider';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatWindow({ conversation, messages, currentUserId, loading, onNewMessage }) {
  const [localMessages, setLocalMessages] = useState(messages);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { socket, connected } = useSocket();

  // Synchroniser les messages avec le prop
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Gérer les WebSocket events
  useEffect(() => {
    if (!socket || !conversation) return;

    // Joindre le thread avec le bon événement
    socket.emit('thread:join', { threadId: conversation._id });

    // Écouter les nouveaux messages
    const handleNewMessage = (messageData) => {
      console.log('🔥 Nouveau message reçu via WebSocket:', messageData);
      setLocalMessages(prev => addMessageSafely(prev, formatMessageForDisplay(messageData, currentUserId)));
      if (onNewMessage) onNewMessage(messageData);
    };

    socket.on('message:received', handleNewMessage);

    return () => {
      socket.off('message:received', handleNewMessage);
    };
  }, [socket, conversation, onNewMessage, currentUserId]);

  const getOtherParticipant = () => {
    return conversation.participants?.find(p => String(p._id) !== String(currentUserId)) || {};
  };

  const sendMessage = async (text) => {
    if (!text.trim() || sendingMessage) return;

    setSendingMessage(true);
    
    const sendViaREST = async (messageText) => {
      try {
        const messageData = {
          threadId: conversation._id,
          text: messageText,
          to: conversation.participants
            .filter(p => String(p._id) !== String(currentUserId))
            .map(p => p._id)
        };

        const result = await sendMessageREST(messageData);
        console.log('✅ Message envoyé via REST:', result);
        
        // Ajouter le message localement
        const newMessage = formatMessageForDisplay({
          _id: result._id || Date.now(),
          text: messageText,
          from: { _id: currentUserId },
          createdAt: new Date(),
          threadId: conversation._id
        }, currentUserId);
        
        setLocalMessages(prev => addMessageSafely(prev, newMessage));
      } catch (error) {
        console.error('❌ Erreur envoi message:', error);
      }
    };
    
    try {
      // Envoyer via WebSocket en priorité
      if (socket && connected) {
        const recipientId = conversation.participants
          .find(p => String(p._id) !== String(currentUserId))?._id;

        socket.emit('message:send', {
          threadId: conversation._id,
          content: text.trim(),
          recipientId
        }, (response) => {
          if (response?.success) {
            console.log('✅ Message envoyé avec succès via WebSocket');
          } else {
            console.error('❌ Erreur envoi WebSocket:', response?.error);
            sendViaREST(text.trim());
          }
        });
        
        console.log('📡 Message envoyé via WebSocket');
      } else {
        console.log('📡 Envoi via REST API (WebSocket non disponible)');
        await sendViaREST(text.trim());
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Chargement des messages...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.477 8-10 8a8.959 8.959 0 01-4.7-1.291L3 21l2.3-3.8A8.959 8.959 0 013 12c0-4.418 4.477-8 10-8s10 3.582 10 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
        <p className="text-sm text-center">Choisissez une conversation pour commencer à discuter</p>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();
  const participantName = otherParticipant.name || otherParticipant.email || 'Utilisateur inconnu';

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header de conversation */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {participantName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{participantName}</h3>
            <p className="text-sm text-gray-500">{otherParticipant.email}</p>
          </div>
        </div>
        <div className="ml-auto">
          {connected ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ● En ligne
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              ● Hors ligne
            </span>
          )}
        </div>
      </div>

      {/* Liste des messages */}
      <MessageList messages={localMessages} currentUserId={currentUserId} />

      {/* Zone de saisie */}
      <MessageInput 
        onSend={sendMessage}
        disabled={sendingMessage}
        placeholder={sendingMessage ? "Envoi en cours..." : "Écrivez votre message..."}
      />
    </div>
  );
}

export default ChatWindow;