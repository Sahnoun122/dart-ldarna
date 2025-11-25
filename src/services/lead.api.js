import { apiDarna } from "./api";

export const createLeadREST = (payload) => {
  return apiDarna.post("/leads", payload).then((r) => r.data);
};
