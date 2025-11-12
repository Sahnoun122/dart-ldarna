# Daret/Darna - Interface Web (Frontend)

## Contexte du projet

Cette application React constitue **l’interface web** d’une plateforme de gestion d’annonces immobilières et d’épargne collective (Daret/Darna).  
Elle se base strictement sur les **APIs existantes** (Tirelire / Darna) et doit être :  

- Performante et responsive  
- Accessible (WCAG)  
- Capable de gérer le temps réel (chat + notifications)  

---

## Fonctionnalités principales côté Frontend

### Annonces immobilières
- Recherche multi-critères : mots-clés, localisation + rayon, prix, surface, nombre de pièces, équipements, type de transaction.
- Liste et carte interactive (cluster, marqueurs, géolocalisation).
- Détail annonce : médias, infos générales, caractéristiques, règles, diagnostics, disponibilité, contact vendeur.
- Création / édition / suppression d’annonces (validation front).
- Gestion de mes annonces : brouillon, publiée, rejetée, promotions.
- Leads & intérêt : déclenchement lead, ouverture thread chat.

### Comptes & abonnements
- Auth : email + mot de passe, SSO OAuth si exposé par API, vérification email, 2FA optionnel.
- Profils : Visiteur, Particulier, Entreprise, Admin.
- Abonnements : gratuit, pro, premium avec effets visibles (priorité affichage, quotas, badges).

### Médias
- Upload images/vidéos via URL présignée MinIO, aperçu, barre de progression, vignettes.

### Temps réel
- Notifications in-app via WebSocket + centre de notifications (marquer tout comme lu).
- Chat vendeur-intéressé : présence, accusés de lecture, envoi fichiers.

### Financement
- Page banques partenaires + simulateur de crédit.
- Intégration Tirelire/Daret (épargne collective) : parcours découverte, redirection/interop si API exposée.

### Daret / Darna
- Liste de groupes, création, gestion membres, tours de contribution, calendrier/étapes.
- Suivi des paiements, historique, rappels/notifications, score de fiabilité.
- Messagerie de groupe (texte + audio si exposé), ouverture de ticket.

### Espace Admin
- Tableau de bord (statistiques clés).
- Modération annonces / signalements.
- Gestion plans & tarifs.
- Validation KYC entreprises + contrôles KYC particuliers.
- Paramètres système visibles si exposés.

---

## Parcours utilisateurs

| Profil | Actions principales |
|--------|-------------------|
| Visiteur | Recherche → consulte détail → contacte (lead) → création compte si nécessaire |
| Particulier / Entreprise | Auth → crée/édite annonce → reçoit leads → chat → gère abonnements → notifications |
| Admin | Auth → modère annonces → valide KYC → suit stats |

## Structure 


frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── logos/
│       └── images/
│
├── src/
│   ├── api/
│   │   ├── axiosClient.js               # Client Axios global
│   │   ├── auth.api.js                  # Auth: login/register
│   │   ├── darna.api.js                 # Routes spécifiques à Darna
│   │   ├── tirelire.api.js              # Routes spécifiques à Tirelire
│   │   ├── annonces.api.js              # Annonces (Darna)
│   │   ├── daret.api.js                 # Groupes Daret (Tirelire)
│   │   └── notifications.api.js         # Notifications en temps réel
│
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── RegisterStep1.jsx            # Étape 1 : infos de base
│   │   ├── RegisterChooseApp.jsx        # Étape 2 : choix Darna ou Tirelire
│   │   ├── VerifyEmail.jsx
│   │   ├── TwoFA.jsx
│   │   └── ResetPassword.jsx
│
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   ├── CardAnnonce.jsx
│   │   ├── ChatBox.jsx
│   │   ├── NotificationBell.jsx
│   │   ├── AppSelectorCard.jsx          # carte Darna / Tirelire
│   │   └── Loader.jsx
│
│   ├── context/
│   │   ├── AuthContext.jsx              # Contexte Auth global
│   │   ├── AppContext.jsx               # Sauvegarde le choix Darna/Tirelire
│   │   ├── ChatContext.jsx
│   │   └── NotificationContext.jsx
│
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   ├── useNotifications.js
│   │   └── useUpload.js
│
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   └── AuthLayout.jsx
│
│   ├── pages/
│   │   ├── Home/
│   │   │   └── Home.jsx
│   │   ├── Annonces/
│   │   │   ├── AnnonceList.jsx
│   │   │   ├── AnnonceDetail.jsx
│   │   │   └── AnnonceForm.jsx
│   │   ├── Daret/
│   │   │   ├── DaretList.jsx
│   │   │   ├── DaretDetail.jsx
│   │   │   └── DaretCreate.jsx
│   │   ├── Profil/
│   │   │   ├── Profile.jsx
│   │   │   └── Subscription.jsx
│   │   ├── Chat/
│   │   │   ├── Inbox.jsx
│   │   │   └── ChatThread.jsx
│   │   ├── Notifications/
│   │   │   └── NotificationCenter.jsx
│   │   ├── Admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Moderation.jsx
│   │   │   ├── PlansTarifs.jsx
│   │   │   ├── KYCValidation.jsx
│   │   │   └── Stats.jsx
│   │   ├── Bank/
│   │   │   ├── BanksList.jsx
│   │   │   └── CreditSimulator.jsx
│   │   ├── Errors/
│   │   │   ├── NotFound.jsx
│   │   │   ├── Forbidden.jsx
│   │   │   └── ServerError.jsx
│   │   └── System/
│   │       ├── Maintenance.jsx
│   │       └── CookiesConsent.jsx
│
│   ├── router/
│   │   ├── AppRouter.jsx
│   │   └── ProtectedRoute.jsx           # protège les routes selon rôle
│
│   ├── store/
│   │   ├── useAuthStore.js
│   │   ├── useAnnonceStore.js
│   │   ├── useDaretStore.js
│   │   ├── useChatStore.js
│   │   ├── useNotificationStore.js
│   │   └── useAppChoiceStore.js         # store pour garder choix Darna/Tirelire
│
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   └── endpoints.js                 # regroupe URLs de chaque backend
│
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── vite.config.js


## Relations avec les Backends

- **Backend1 (Tirelire)** :  
  - Authentification, annonces immobilières, leads, chat vendeur-intéressé  
  - URL base : `http://tirelire:5000/api` (Docker Compose)  

- **Backend2 (Darna)** :  
  - Épargne collective, Daret/Darna groupes, contributions, tickets  
  - URL base : `http://darna:5001/api` (Docker Compose)  

- **Temps réel (WebSocket)** :  
  - Tirelire → chat et notifications  
  - Darna → notifications contributions / paiements / tickets  

---

## Lancer l’application (avec Docker)

1. Placer le projet dans un dossier local (éviter OneDrive) :

```bash
cd my-app

