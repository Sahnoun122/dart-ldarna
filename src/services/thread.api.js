import { addPointerEvent } from "framer-motion";
import { apiDarna } from "./api";
export const createThread = (payload)=>{
    apiDarna.post("/thread" , payload).then((r)=> r.data);
}

export const getThreadMessage = (threadId)=> {
    apiDarna.get(`/thread/ ${threadId}/message` ).then((r)=> r.data);
}

