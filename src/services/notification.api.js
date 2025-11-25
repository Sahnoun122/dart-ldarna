import { apiDarna } from "./api";
export const getNotifications = (limit = 50)=>{

    apiDarna.get(`/notifications?limit=${limit}`).then((r)=>r.data);

}

export const markNotificationsRead = (notificationIds)=>{
    apiDarna.put("/notifications/read" , {notificationIds}).then((r)=> r.data)
}

export const getUnreadCount = ()=>{
    apiDarna.get("/notifications/unread-count").then((r)=> r.data);
}