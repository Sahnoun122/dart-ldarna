import { useNotification } from "../context/NotificationContext";

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  const getNotificationStyle = (type) => {
    const baseStyle = "mb-2 p-3 rounded-lg shadow-md flex justify-between items-center";
    
    switch (type) {
      case "success":
        return `${baseStyle} bg-green-100 text-green-800 border-l-4 border-green-500`;
      case "error":
        return `${baseStyle} bg-red-100 text-red-800 border-l-4 border-red-500`;
      case "info":
      default:
        return `${baseStyle} bg-blue-100 text-blue-800 border-l-4 border-blue-500`;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={getNotificationStyle(notification.type)}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-2 text-gray-600 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}