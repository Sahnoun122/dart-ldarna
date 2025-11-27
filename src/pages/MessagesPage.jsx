import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserId } from '../utils/userUtils';
import Navbar from '../components/Navbar';
import ConversationList from '../components/ConversationList';
import ChatWindowSimple from '../components/ChatWindowSimple';
import UserStatusBadge from '../components/UserStatusBadge';
import { getThreadsForUser } from '../services/thread.api';

function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUserId = getUserId(user);

  console.log('📱 MessagesPage - currentUserId:', currentUserId);
  console.log('📱 MessagesPage - conversations:', conversations.length);
  console.log('📱 MessagesPage - selectedConversation:', selectedConversation?._id);

  // Charger les conversations au démarrage
  useEffect(() => {
    if (!currentUserId) return;
    
    const loadConversations = async () => {
      console.log('🔄 Chargement initial des conversations...');
      try {
        setLoading(true);
        const threads = await getThreadsForUser();
        console.log('✅ Conversations chargées:', threads);
        
        // Formater les conversations avec les bonnes données
        const formattedConversations = threads.map(thread => {
          const otherParticipant = thread.participants?.find(p => 
            String(p._id) !== String(currentUserId)
          );
          
          return {
            ...thread,
            otherParticipant: otherParticipant || {
              _id: 'unknown',
              name: 'Utilisateur',
              email: 'utilisateur@example.com'
            }
          };
        });
        
        setConversations(formattedConversations);
      } catch (error) {
        console.error('❌ Erreur chargement conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [currentUserId]);

  // Vérifier si un thread spécifique est demandé dans l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const threadId = urlParams.get('thread');
    
    if (threadId && conversations.length > 0) {
      const conversation = conversations.find(c => c._id === threadId);
      if (conversation) {
        console.log('📍 Sélection conversation depuis URL:', threadId);
        setSelectedConversation(conversation);
      }
    }
  }, [conversations]);

  // Recharger automatiquement les conversations toutes les 5 secondes
  useEffect(() => {
    if (!currentUserId) return;
    
    const reloadConversations = async () => {
      try {
        const threads = await getThreadsForUser();
        const formattedConversations = threads.map(thread => {
          const otherParticipant = thread.participants?.find(p => 
            String(p._id) !== String(currentUserId)
          );
          
          return {
            ...thread,
            otherParticipant: otherParticipant || {
              _id: 'unknown',
              name: 'Utilisateur',
              email: 'utilisateur@example.com'
            }
          };
        });
        
        setConversations(formattedConversations);
      } catch (error) {
        console.error('❌ Erreur rechargement auto conversations:', error);
      }
    };

    // Recharger automatiquement toutes les 5 secondes
    const interval = setInterval(reloadConversations, 5000);
    
    return () => clearInterval(interval);
  }, [currentUserId]);

  // Sélectionner une conversation
  const selectConversation = (conversation) => {
    console.log('🔄 Sélection conversation:', conversation._id);
    setSelectedConversation(conversation);
  };

  if (loading && conversations.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-100 pt-16">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
            <div className="flex h-full">
              {/* Liste des conversations */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Mes Conversations</h2>
                  <p className="text-sm text-gray-600">{conversations.length} conversation(s)</p>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Aucune conversation pour l'instant
                    </div>
                  ) : (
                    <ConversationList
                      conversations={conversations}
                      selectedConversation={selectedConversation}
                      onSelectConversation={selectConversation}
                      currentUserId={currentUserId}
                    />
                  )}
                </div>
              </div>

              {/* Zone de chat */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <ChatWindowSimple
                    conversation={selectedConversation}
                    currentUserId={currentUserId}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-lg mb-2">Sélectionnez une conversation</div>
                      <div className="text-sm">
                        Debug: {conversations.length} conversations chargées
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <UserStatusBadge />
    </>
  );
}

export default MessagesPage;