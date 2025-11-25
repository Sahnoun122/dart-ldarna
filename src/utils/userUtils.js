// Utilitaires pour normaliser les données utilisateur
export const getUserId = (user) => {
  return user?.id || user?._id;
};

export const getUserDisplayName = (user) => {
  return user?.username || user?.firstName || user?.name || user?.email || 'Utilisateur';
};

export const getUserEmail = (user) => {
  return user?.email;
};

export const isValidUser = (user) => {
  return user && (user.id || user._id) && user.email;
};