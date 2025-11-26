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

export const getThreadMessage = async (threadId) => {
    try {
        const response = await apiDarna.get(`/thread/${threadId}/message`);
        return response.data;
    } catch (error) {
        console.error("Erreur getThreadMessage:", error);
        throw error;
    }
}

