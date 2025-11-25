import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
import { createLeadREST } from "../services/lead.api";
import { createThread } from "../services/thread.api";
import { sendMessageREST } from "../services/message.api";
import { useSocket } from "../socket/SocketProvider";
import Navbar from "../components/Navbar";
import MessageInput from "../components/MessageInput";
import MessageList from "../components/MessageList";

function AnnonceDetail() {
  const { id } = useParams();
  const { getPropertyById } = useProperties();
  const { socket, user } = useSocket();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [threadId, setThreadId] = useState("");
  const [messages, setMessages] = useState([]);


  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message:new", (msg) => {
      if (msg.threadId === threadId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("message:new");
  }, [socket, threadId]);

 const startConversation = async () => {
   if (!user) {
     alert("Vous devez être connecté pour contacter le propriétaire");
     return;
   }

   if (!property) {
     console.log("Property undefined, cannot start conversation");
     return;
   }

   try {
     const lead = await createLeadREST({
       propertyId: property._id,
       ownerId: property.userId,
       message: "Bonjour, je suis intéressé(e)",
     });

     const threadRes = await createThread({
       property: property._id,
       participants: [user._id, property.userId],
     });

     setThreadId(threadRes.thread._id);
   } catch (error) {
     console.log("Erreur conversation:", error);
   }
 };


  const sendMessage = async (text) => {
    try {
      const msg = await sendMessageREST({
        threadId,
        text,
        to: [property.userId],
      });

      setMessages((prev) => [...prev, msg]);
    } catch (error) {
      console.log("Erreur message :", error);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <p className="text-center p-4">Chargement...</p>
    </>
  );
  if (!property) return (
    <>
      <Navbar />
      <p className="text-center p-4">Annonce introuvable</p>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {property.media?.images?.length ? (
          property.media.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="h-48 w-full object-cover rounded"
            />
          ))
        ) : (
          <img
            src="https://via.placeholder.com/400"
            alt="placeholder"
            className="h-48 w-full object-cover rounded"
          />
        )}
      </div>

      <p>💰 Prix: {property.price} MAD</p>
      <p>📌 Type: {property.type}</p>
      <p>📍 Adresse: {property.address?.city}</p>

      {!threadId && (
        <button
          onClick={startConversation}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Contacter le propriétaire
        </button>
      )}

      {threadId && (
        <div className="border p-4 rounded mt-6">
          <h2 className="text-xl font-semibold mb-3">Conversation</h2>

          <MessageList messages={messages} currentUserId={user._id} />

          <MessageInput onSend={sendMessage} />
        </div>
      )}
      </div>
    </>
  );
}

export default AnnonceDetail;
