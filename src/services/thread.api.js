import { apiDarna } from "./api";

export const createThread = async (payload) => {
    try {
        const response = await apiDarna.post("/thread", payload);
        return response.data;
    } catch (error) {
        console.error("Erreur createThread:", error);
        throw error;
    }
}

// Récupérer tous les threads d'un utilisateur
export const getThreadsForUser = async () => {
  try {
    const response = await apiDarna.get('/thread/user');
    return response.data;
  } catch (error) {
    console.error('Erreur getThreadsForUser:', error);
    throw error;
  }
};

// Récupérer les messages d'un thread
export const getThreadMessages = async (threadId) => {
  try {
    const response = await apiDarna.get(`/thread/${threadId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Erreur getThreadMessages:', error);
    throw error;
  }
};

// Envoyer un message dans un thread
export const sendMessage = async (threadId, content) => {
  try {
    const response = await apiDarna.post(`/thread/${threadId}/messages`, { content });
    return response.data;
  } catch (error) {
    console.error('Erreur sendMessage:', error);
    throw error;
  }
};

export const getThreadMessage = async (threadId) => {
    try {
        const response = await apiDarna.get(`/thread/${threadId}/message`);
        return response.data;
    } catch (error) {
        console.error("Erreur getThreadMessage:", error);
        throw error;
    }
}

// Marquer les messages comme lus
export const markMessagesAsRead = async (threadId, messageIds) => {
  try {
    const response = await apiDarna.post(`/thread/${threadId}/read`, { messageIds });
    return response.data;
  } catch (error) {
    console.error('Erreur markMessagesAsRead:', error);
    throw error;
  }
};

