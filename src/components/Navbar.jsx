import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NotificationsCenter from "./NotificationsCenter";
import { useSocket } from "../socket/SocketProvider";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { unreadCount } = useSocket();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive(to)
          ? "bg-blue-100 text-blue-700"
          : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            DARNA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Navigation principale pour utilisateurs connectés */}
                <NavLink to="/annonces">Marketplace</NavLink>
                <NavLink to="/dashboard-darna">Dashboard Darna</NavLink>
                <NavLink to="/dashboard-tirelire">Dashboard Tirelire</NavLink>
                <NavLink to="/properties">Mes Propriétés</NavLink>
                
                {/* Notifications */}
                <div className="relative">
                  <NotificationsCenter />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>

                {/* Profile et déconnexion */}
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm text-gray-600">
                    Bonjour, {user.username || user.firstName || user.name || user.email || 'Utilisateur'}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Navigation pour visiteurs */}
                <NavLink to="/">Accueil</NavLink>
                <NavLink to="/annonces">Annonces</NavLink>
                <NavLink to="/pricing">Tarifs</NavLink>
                <NavLink to="/login">Connexion</NavLink>
                <NavLink to="/register">Inscription</NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <div className="relative mr-2">
                <NotificationsCenter />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t bg-gray-50">
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm font-medium text-gray-900 border-b">
                    Bonjour, {user.username || user.firstName || user.name || user.email || 'Utilisateur'}
                  </div>
                  <NavLink to="/annonces" onClick={() => setIsMobileMenuOpen(false)}>
                    Marketplace
                  </NavLink>
                  <NavLink to="/dashboard-darna" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard Darna
                  </NavLink>
                  <NavLink to="/dashboard-tirelire" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard Tirelire
                  </NavLink>
                  <NavLink to="/properties" onClick={() => setIsMobileMenuOpen(false)}>
                    Mes Propriétés
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                    Accueil
                  </NavLink>
                  <NavLink to="/annonces" onClick={() => setIsMobileMenuOpen(false)}>
                    Annonces
                  </NavLink>
                  <NavLink to="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                    Tarifs
                  </NavLink>
                  <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Connexion
                  </NavLink>
                  <NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    Inscription
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
