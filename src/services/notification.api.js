import { apiDarna } from "./api";

export const getNotifications = async (limit = 50) => {
    try {
        const response = await apiDarna.get(`/notifications?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Erreur getNotifications:", error);
        throw error;
    }
}

export const markNotificationsRead = async (notificationIds) => {
    try {
        const response = await apiDarna.put("/notifications/read", {notificationIds});
        return response.data;
    } catch (error) {
        console.error("Erreur markNotificationsRead:", error);
        throw error;
    }
}

export const getUnreadCount = async () => {
    try {
        const response = await apiDarna.get("/notifications/unread-count");
        return response.data;
    } catch (error) {
        console.error("Erreur getUnreadCount:", error);
        throw error;
    }
}