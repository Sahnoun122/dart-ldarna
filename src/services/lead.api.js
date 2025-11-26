import { apiDarna } from "./api";

export const createLeadREST = async (payload) => {
  try {
    const response = await apiDarna.post("/leads", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur createLeadREST:", error);
    throw error;
  }
};
