import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

export default function DashboardTirelire() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard Tirelire
          </h1>
          <p className="text-gray-600">
            Bienvenue {user?.firstName || user?.name || 'Utilisateur'} - Gestion de votre épargne collective
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="text-green-600 text-2xl mr-4">💰</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Mes Épargnes</h3>
                <p className="text-gray-500">Suivi de vos groupes</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="text-blue-600 text-2xl mr-4">👥</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Groupes</h3>
                <p className="text-gray-500">Épargne collaborative</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="text-purple-600 text-2xl mr-4">📊</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Objectifs</h3>
                <p className="text-gray-500">Suivi des progrès</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Créer un Groupe</h2>
                <p className="text-green-100">Lancez un nouveau projet d'épargne collective</p>
                <button className="mt-4 bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  Commencer
                </button>
              </div>
              <div className="text-4xl">➕</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Rejoindre un Groupe</h2>
                <p className="text-blue-100">Participez à des groupes d'épargne existants</p>
                <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Explorer
                </button>
              </div>
              <div className="text-4xl">🔍</div>
            </div>
          </div>
        </div>

        {/* Section en cours de développement */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="text-yellow-600 text-2xl mr-4">🚧</div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Fonctionnalités en développement</h3>
              <p className="text-yellow-700">Les fonctionnalités avancées de Tirelire sont en cours de développement.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
