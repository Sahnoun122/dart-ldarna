// Utilitaire pour tester la connectivité WebSocket
export const checkSocketHealth = (socket) => {
  if (!socket) {
    console.warn("❌ Socket non initialisée");
    return false;
  }

  const status = {
    connected: socket.connected,
    id: socket.id,
    transport: socket.io?.engine?.transport?.name || 'inconnu',
    readyState: socket.io?.engine?.readyState,
    url: socket.io?.uri || 'inconnue'
  };

  console.log("🔍 État Socket:", status);
  
  if (socket.connected) {
    console.log("✅ Socket connectée et opérationnelle");
    return true;
  } else {
    console.warn("⚠️ Socket déconnectée");
    return false;
  }
};

export const testSocketMessage = (socket, threadId) => {
  if (!socket || !socket.connected) {
    console.error("❌ Socket non disponible pour le test");
    return;
  }

  console.log("🧪 Test d'envoi de message...");
  
  const testMessage = {
    threadId,
    text: "Message de test - " + new Date().toLocaleTimeString(),
    to: ["test"]
  };

  socket.emit("message:send", testMessage, (ack) => {
    if (ack?.status === 'ok') {
      console.log("✅ Test réussi:", ack);
    } else {
      console.error("❌ Test échoué:", ack);
    }
  });
};

export const debugSocketConnection = (socket) => {
  if (!socket) {
    console.error("❌ Socket non fournie pour le debug");
    return;
  }

  console.log("🔧 Debug Socket:");
  console.log("- Connectée:", socket.connected);
  console.log("- ID:", socket.id);
  console.log("- Auth:", socket.auth);
  console.log("- Transport:", socket.io?.engine?.transport?.name);
  console.log("- URL:", socket.io?.uri);
  console.log("- Options:", socket.io?.opts);
  
  // Test de ping
  const startTime = Date.now();
  socket.emit("ping", (response) => {
    const latency = Date.now() - startTime;
    console.log("🏓 Ping réponse:", response, "Latence:", latency + "ms");
  });
};