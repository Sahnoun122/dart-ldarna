import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";
import { createLeadREST } from "../services/lead.api";
import { createThread } from "../services/thread.api";
import { sendMessageREST } from "../services/message.api";
import { useSocket } from "../socket/SocketProvider";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { getUserId, getUserDisplayName, isValidUser } from "../utils/userUtils";
import { safeExtractId, debugApiResponse } from "../utils/apiUtils";
import { addMessageSafely, formatMessageForDisplay } from "../utils/messageUtils";
import Navbar from "../components/Navbar";
import MessageInput from "../components/MessageInput";
import MessageList from "../components/MessageList";

function AnnonceDetail() {
  const { id } = useParams();
  const { getPropertyById } = useProperties();
  const { socket, joinThread, sendMessage: sendSocketMessage, connected } = useSocket();
  const { user, debugAuthState } = useAuth();
  const { success, error } = useNotification();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [threadId, setThreadId] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        error("Erreur lors du chargement de l'annonce");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, getPropertyById, error]);

  // Gestion des WebSockets pour les messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      console.log("📨 Nouveau message reçu:", data);
      const { message } = data;
      
      // Vérifier si c'est pour notre thread actuel
      if (message.threadId === threadId) {
        setMessages((prev) => addMessageSafely(prev, formatMessageForDisplay(message)));
      }
    };

    const handleThreadJoined = (data) => {
      console.log("✅ Thread rejoint:", data);
    };

    const handleError = (error) => {
      console.error("❌ Erreur socket:", error);
    };

    // S'abonner aux événements
    socket.on("message:new", handleNewMessage);
    socket.on("thread:joined", handleThreadJoined);
    socket.on("error", handleError);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("thread:joined", handleThreadJoined);
      socket.off("error", handleError);
    };
  }, [socket, threadId]);

  // Rejoindre le thread quand threadId est défini
  useEffect(() => {
    if (threadId && socket && connected) {
      console.log("🏠 Rejoindre le thread:", threadId);
      joinThread(threadId);
    }
  }, [threadId, socket, connected, joinThread]);

 const startConversation = async () => {
   if (!isValidUser(user)) {
     error("Vous devez être connecté pour contacter le propriétaire");
     return;
   }

   if (!property) {
     error("Impossible de charger les informations de la propriété");
     return;
   }

   // Vérifier que l'utilisateur ne contacte pas sa propre propriété
   const userId = getUserId(user);
   if (property.userId === userId) {
     error("Vous ne pouvez pas contacter votre propre annonce");
     return;
   }

   try {
     // Créer le lead d'abord
     const lead = await createLeadREST({
       propertyId: property._id,
       ownerId: property.userId,
       message: "Bonjour, je suis intéressé(e) par votre propriété",
     });

     debugApiResponse("createLeadREST", lead);

     // Créer le thread
     const threadRes = await createThread({
       property: property._id,
       participants: [userId, property.userId],
     });

     // Extraire l'ID de façon sécurisée
     const extractedThreadId = safeExtractId(threadRes, "createThread");
     
     setThreadId(extractedThreadId);
     success("Conversation démarrée avec succès!");
   } catch (err) {
     console.error("Erreur conversation complète:", err);
     const errorMessage = err.response?.data?.message || err.message || "Erreur inconnue";
     error("Erreur lors de la création de la conversation: " + errorMessage);
   }
 };


  const sendMessage = async (text) => {
    if (!text.trim()) {
      error("Le message ne peut pas être vide");
      return;
    }

    if (!threadId) {
      error("Aucune conversation active");
      return;
    }

    setSendingMessage(true);
    
    try {
      const messageData = {
        threadId,
        text: text.trim(),
        to: [property.userId],
      };
      
      console.log("📤 Envoi message:", messageData);

      // Utiliser SEULEMENT l'API REST pour éviter les doublons
      const msg = await sendMessageREST(messageData);
      
      // Ajouter le message à l'interface de manière sécurisée
      setMessages((prev) => addMessageSafely(prev, formatMessageForDisplay(msg)));
      
      success("Message envoyé!");
      
    } catch (err) {
      console.error("❌ Erreur envoi message:", err);
      error("Erreur lors de l'envoi: " + (err.response?.data?.message || err.message));
    } finally {
      setSendingMessage(false);
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

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-lg font-semibold mb-2">💰 Prix: {property.price?.toLocaleString() || 'Non spécifié'} MAD</p>
        <p className="mb-1">📌 Type: {property.transactionType || property.type || 'Non spécifié'}</p>
        <p className="mb-1">📍 Adresse: {property.location?.city || property.address?.city || 'Non spécifié'}</p>
        <p className="mb-1">🏠 Surface: {property.characteristics?.surface || 'Non spécifié'} m²</p>
        <p className="mb-1">🛏 Chambres: {property.characteristics?.bedrooms || 'Non spécifié'}</p>
        {property.description && (
          <div className="mt-3">
            <p className="font-medium">Description:</p>
            <p className="text-gray-700">{property.description}</p>
          </div>
        )}
      </div>

      {!isValidUser(user) ? (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-3">
            <div className="text-yellow-600 text-2xl mr-3">🔐</div>
            <h3 className="text-lg font-semibold text-yellow-800">Connexion requise</h3>
          </div>
          <p className="text-yellow-700 mb-4">Vous devez être connecté pour contacter le propriétaire et démarrer une conversation.</p>
          <div className="flex gap-3">
            <a 
              href="/login" 
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            >
              Se connecter
            </a>
            <a 
              href="/register" 
              className="bg-white text-yellow-600 border border-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors font-medium"
            >
              Créer un compte
            </a>
          </div>
        </div>
      ) : property.userId === getUserId(user) ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center">
            <div className="text-blue-600 text-2xl mr-3">👤</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Votre annonce</h3>
              <p className="text-blue-700">Ceci est votre propre annonce. Vous ne pouvez pas vous contacter vous-même.</p>
            </div>
          </div>
        </div>
      ) : !threadId ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-green-600 text-2xl mr-3">💬</div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">Contactez le propriétaire</h3>
                <p className="text-green-700">Démarrez une conversation pour obtenir plus d'informations sur cette propriété.</p>
              </div>
            </div>
            <button
              onClick={startConversation}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              💬 Contacter
            </button>
          </div>
        </div>
      ) : null}

      {threadId && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mt-8 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="text-blue-600 text-2xl mr-3">💬</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Conversation avec le propriétaire</h2>
              <p className="text-gray-600 text-sm">Discutez directement avec le propriétaire de cette propriété</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 mb-4 max-h-80 overflow-y-auto">
            <MessageList messages={messages} currentUserId={getUserId(user)} />
          </div>

          <div className="border-t pt-4">
            <MessageInput 
              onSend={sendMessage} 
              disabled={sendingMessage} 
            />
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default AnnonceDetail;
