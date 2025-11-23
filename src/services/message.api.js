import { apiDarna } from "./api";
export const sendMessageREST = (data)=>{
    apiDarna.post("/api/message" , data).then((r)=> r.data);
}

