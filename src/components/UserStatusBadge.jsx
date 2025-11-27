import React from 'react';

function UserStatusBadge({ user, size = 'sm' }) {
  const getStatusConfig = () => {
    if (!user) return { text: 'Invité', color: 'gray', icon: '👤' };
    
    if (user.role === 'vendor' || user.role === 'admin') {
      return { 
        text: 'Vendeur', 
        color: 'green', 
        icon: '🏪',
        description: 'Propriétaire vérifié'
      };
    }
    
    return { 
      text: 'Visiteur', 
      color: 'blue', 
      icon: '🔍',
      description: 'Cherche un bien'
    };
  };

  const { text, color, icon, description } = getStatusConfig();
  
  const sizeClasses = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-2'
  };

  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  return (
    <div 
      className={`inline-flex items-center space-x-1 rounded-full border font-medium ${sizeClasses[size]} ${colorClasses[color]}`}
      title={description}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export default UserStatusBadge;