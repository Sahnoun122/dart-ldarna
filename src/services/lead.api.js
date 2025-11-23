import { apiDarna } from "./api";

export const createLeadREST = (payload)=>{
    apiDarna.post("/api/leads/create" , payload).then((r)=> r.data);
}