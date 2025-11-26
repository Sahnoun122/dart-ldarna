// Test simple de connectivité API
export const checkAPIHealth = async () => {
  const apiUrl = import.meta.env.VITE_API_DARNA || "http://localhost:5001/api";
  
  try {
    console.log(`🔍 Test de connexion vers: ${apiUrl}`);
    
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ API accessible:", data);
      return true;
    } else {
      console.warn(`⚠️ API accessible mais erreur: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error("❌ API inaccessible:", error.message);
    
    if (error.message.includes('CORS')) {
      console.log("💡 Problème CORS détecté");
    } else if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
      console.log("💡 Le serveur backend semble être arrêté");
    } else if (error.message.includes('ERR_CONNECTION_REFUSED')) {
      console.log("💡 Connexion refusée - vérifiez que le serveur fonctionne");
    }
    
    return false;
  }
};

export const testAPIEndpoints = async () => {
  const baseUrl = import.meta.env.VITE_API_DARNA || "http://localhost:5001/api";
  const endpoints = [
    '/health',
    '/properties/all',
    '/message', 
    '/thread',
    '/leads'
  ];
  
  console.log("🧪 Test des endpoints API...");
  
  for (const endpoint of endpoints) {
    try {
      const url = `${baseUrl}${endpoint}`;
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`${endpoint}: ${response.status === 404 ? '❌ Non trouvé' : response.ok ? '✅ OK' : '⚠️ Erreur'}`);
    } catch (error) {
      console.log(`${endpoint}: ❌ Inaccessible`);
    }
  }
};

// Test de connectivité WebSocket
export const testWebSocketConnection = () => {
  const wsUrl = import.meta.env.VITE_WS_URL || "http://localhost:5001";
  
  console.log(`🔌 Test WebSocket vers: ${wsUrl}`);
  
  return new Promise((resolve) => {
    try {
      // Import dynamique pour éviter les erreurs côté serveur
      import('socket.io-client').then(({ io }) => {
        const testSocket = io(wsUrl, {
          autoConnect: false,
          timeout: 5000,
          transports: ['websocket', 'polling']
        });

        testSocket.on('connect', () => {
          console.log('✅ WebSocket connecté avec succès');
          testSocket.disconnect();
          resolve(true);
        });

        testSocket.on('connect_error', (error) => {
          console.error('❌ Erreur connexion WebSocket:', error.message);
          testSocket.disconnect();
          resolve(false);
        });

        testSocket.connect();

        // Timeout de sécurité
        setTimeout(() => {
          if (!testSocket.connected) {
            console.warn('⏰ Timeout connexion WebSocket');
            testSocket.disconnect();
            resolve(false);
          }
        }, 5000);
      }).catch((error) => {
        console.error('❌ Erreur import socket.io-client:', error);
        resolve(false);
      });

    } catch (error) {
      console.error('❌ Erreur test WebSocket:', error);
      resolve(false);
    }
  });
};

// Test complet de la stack
export const runFullConnectivityTest = async () => {
  console.log("🚀 Début des tests de connectivité...");
  
  const results = {
    api: await checkAPIHealth(),
    endpoints: null,
    websocket: await testWebSocketConnection()
  };
  
  if (results.api) {
    await testAPIEndpoints();
  }
  
  console.log("📊 Résultats des tests:", results);
  
  if (results.api && results.websocket) {
    console.log("🎉 Tous les tests sont passés avec succès!");
  } else {
    console.warn("⚠️ Certains tests ont échoué. Vérifiez la configuration.");
  }
  
  return results;
};