import React , {Children, createContext , useContext , useEffect , useState} from "react";
import { socket, Socket } from "./socket";

const SocketContext = createContext();

export const SocketProvider = ({Children})=>{
    const [connected , setConnected]= useState(false);
    const [notifications , setNotifications]= useState([]);
    const [unreadCount , setUnreadCount] = useState(0);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    useEffect(()=>{
        if(!user || !token) return;

        socket.auth = {token};
        socket.connect();

        socket.on("connect" , ()=>{
            setConnected(true);
        });

        socket.on("dosconnect", ()=> setConnected(false));

        socket.on("notifications:new" ,(notif)=>{
            setNotifications((prev)=> [notif,...prev]);
            setUnreadCount((c)=> c+1);
        });

        socket.on("lead:new" , ({thread , sysMg})=>{
            setNotifications((prev)=>[{
                id:sysMg._id || `lead-${thread._id}`,
                type: "new_lead",
                title : "Nouveau lead",
                message : "un utulisateur est intéressé par votre propriété",
                payload : {threadId : thread._id},
                read : false , 
                createdAt : new Date().toISOString(),
            },
        ...prev,
    ]);
            setUnreadCount((c) => c + 1);

        });

        socket.on("message:new", ({message})=>{

        })
        return ()=>{
            socket.off("connect");
            socket.off("disconnect");
            socket.off("notifications:new");
            socket.off("lead:new");
            socket.disconnect();
        };
    }, [user , token ]);

    const markAllNotificationsRead  = async()=>{
        const ids = notifications.filter((n)=> !n.read.map((n)=> n.id));
        if(ids.length ===0) return ;

        socket.emit("notifications:read", {notificationIds : ids},(ack)=>{
            if(ack?.status === "ok"){
                setNotifications((prev)=> prev.map((n)=> ({...n, read : true})));
                setUnreadCount(0);

            }
        })
    }

return (
  <SocketContext.Provider
    value={{
      socket,
      connected,
      notifications,
      setNotifications,
      unreadCount,
      setUnreadCount,
      markAllNotificationsRead,
    }}
  >
    {Children}
  </SocketContext.Provider>
);
};

export const useSocket = ()=> useContext(SocketContext);

