import { addPointerEvent } from "framer-motion";
import { apiDarna } from "./api";
export const createThread = (payload)=>{
    apiDarna.post("/api/thread" , payload).then((r)=> r.data);
}

export const getThreadMessage = (threadId)=> {
    apiDarna.get(`/api/thread/ ${threadId}/message` ).then((r)=> r.data);
}

