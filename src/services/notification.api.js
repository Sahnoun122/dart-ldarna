import { apiDarna } from "./api";
export const getNotifications = (limit = 50)=>{

    apiDarna.get(`/api/notifications?limit=${limit}`).then((r)=>r.data);

}

export const markNotificationsRead = (notificationIds)=>{
    apiDarna.put("/api/notifications/read" , {notificationIds}).then((r)=> r.data)
}

export const getUnreadCount = ()=>{
    apiDarna.get("/api/notifications/unread-count").then((r)=> r.data);
}