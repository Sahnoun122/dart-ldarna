import { apiDarna } from "./api";

export const sendMessageREST = async (data) => {
  try {
    const response = await apiDarna.post("/message", data);
    return response.data;
  } catch (error) {
    console.error("Erreur sendMessageREST:", error);
    throw error;
  }
};

