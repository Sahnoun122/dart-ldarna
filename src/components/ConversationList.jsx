import React from 'react';

function ConversationList({ conversations, selectedConversation, onSelectConversation, currentUserId }) {
  
  const getOtherParticipant = (conversation) => {
    console.log('🔍 Debug conversation:', {
      conversationId: conversation._id,
      participants: conversation.participants,
      currentUserId: currentUserId
    });
    
    const other = conversation.participants?.find(p => {
      const participantId = p._id || p;
      const different = String(participantId) !== String(currentUserId);
      console.log('👥 Participant check:', {
        participantId,
        currentUserId,
        different,
        participantData: p
      });
      return different;
    }) || {};
    
    console.log('✅ Autre participant trouvé:', other);
    return other;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 jours
      return messageDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const getConversationTitle = (conversation) => {
    const otherParticipant = getOtherParticipant(conversation);
    if (otherParticipant.name) {
      return otherParticipant.name;
    }
    if (otherParticipant.email) {
      return otherParticipant.email.split('@')[0];
    }
    return 'Visiteur';
  };

  const getConversationSubtitle = (conversation) => {
    const otherParticipant = getOtherParticipant(conversation);
    if (conversation.property) {
      return `💬 À propos de: ${conversation.property.title}`;
    }
    if (otherParticipant.email) {
      return `📧 ${otherParticipant.email}`;
    }
    return 'Nouvelle conversation';
  };

  return (
    <div className="divide-y divide-gray-100">
      {conversations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <div className="mb-4">💬</div>
          <p className="text-lg font-medium">Aucune conversation</p>
          <p className="text-sm mt-2">Vos conversations apparaîtront ici une fois que vous aurez contacté un propriétaire</p>
        </div>
      ) : (
        conversations.map((conversation) => {
          const isSelected = selectedConversation?._id === conversation._id;
          const lastMessage = conversation.lastMessage;
          const unreadCount = conversation.unreadCount || 0;
          
          return (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                isSelected ? 'bg-blue-50 border-r-4 border-blue-600 shadow-sm' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                
                {/* Avatar avec indicateur en ligne */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-lg">
                      {getConversationTitle(conversation).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Indicateur en ligne (optionnel - à implémenter plus tard) */}
                  {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div> */}
                </div>

                {/* Contenu de la conversation */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">
                      {getConversationTitle(conversation)}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500 shrink-0">
                        {lastMessage?.createdAt && formatTime(lastMessage.createdAt)}
                      </p>
                      {unreadCount > 0 && (
                        <div className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center font-medium">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dernier message */}
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 truncate">
                      {lastMessage?.text ? (
                        <>
                          {String(lastMessage.from) === String(currentUserId) && (
                            <span className="text-blue-600 mr-1 font-medium">Vous:</span>
                          )}
                          {lastMessage.text}
                        </>
                      ) : (
                        <span className="italic text-gray-400">
                          {getConversationSubtitle(conversation)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Informations sur la propriété */}
                  {conversation.property && (
                    <div className="flex items-center text-xs text-gray-500 bg-gray-50 rounded-md px-2 py-1">
                      <span className="mr-1">🏠</span>
                      <span className="truncate font-medium">{conversation.property.title}</span>
                      {conversation.property.price && (
                        <span className="ml-2 text-green-600 font-semibold">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(conversation.property.price)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default ConversationList;