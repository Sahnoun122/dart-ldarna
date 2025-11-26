// Utilitaire pour gérer les messages sans doublons

export const addMessageSafely = (messages, newMessage) => {
  // Vérifier si le message existe déjà
  const messageExists = messages.some(existingMessage => {
    // Vérification par ID
    if (existingMessage._id && newMessage._id) {
      return existingMessage._id === newMessage._id;
    }
    
    // Vérification par contenu et timestamp (pour les messages très récents)
    const sameContent = existingMessage.text === newMessage.text;
    const sameAuthor = existingMessage.from === newMessage.from;
    const timeDiff = Math.abs(
      new Date(existingMessage.createdAt) - new Date(newMessage.createdAt)
    );
    
    return sameContent && sameAuthor && timeDiff < 5000; // 5 secondes
  });

  if (messageExists) {
    console.log("⚠️ Message déjà présent, ignoré");
    return messages;
  }

  console.log("✅ Nouveau message ajouté");
  return [...messages, newMessage];
};

export const formatMessageForDisplay = (message) => {
  return {
    _id: message._id,
    text: message.text,
    from: message.from,
    to: message.to,
    createdAt: message.createdAt,
    threadId: message.threadId
  };
};