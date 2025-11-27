import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function DashboardDarna() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard Darna
          </h1>
          <p className="text-gray-600">
            Bienvenue {user?.username || user?.firstName || user?.name || user?.email || 'Utilisateur'} - Gestion de vos biens immobiliers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="text-blue-600 text-2xl mr-4">🏠</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Mes Propriétés</h3>
                <p className="text-gray-500">Gérer vos annonces</p>
              </div>
            </div>
          </div>
          <Link 
            to="/messages"
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer block"
          >
            <div className="flex items-center">
              <div className="text-green-600 text-2xl mr-4">💬</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
                <p className="text-gray-500">Communications clients</p>
              </div>
            </div>
          </Link>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="text-orange-600 text-2xl mr-4">📊</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Statistiques</h3>
                <p className="text-gray-500">Performance de vos biens</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/properties"
            className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Mes Propriétés</h2>
                <p className="text-blue-100">Voir et gérer toutes vos annonces immobilières</p>
              </div>
              <div className="text-4xl">🏢</div>
            </div>
          </Link>

          <Link
            to="/messages"
            className="block bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Messages</h2>
                <p className="text-purple-100">Gérer vos conversations avec les clients</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </Link>

          <Link
            to="/annonces"
            className="block bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Marketplace</h2>
                <p className="text-green-100">Explorer les annonces disponibles</p>
              </div>
              <div className="text-4xl">🏦</div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
