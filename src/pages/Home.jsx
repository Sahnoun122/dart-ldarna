import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Home() {
  const { chooseAPI, user } = useAuth();

  // Si l'utilisateur est connecté, le rediriger vers son dashboard
  if (user) {
    return <Navigate to="/dashboard-darna" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">
            Dart & Darna
          </h1>
          <p className="text-xl mb-8 text-gray-600 leading-relaxed">
            Plateforme professionnelle de gestion immobilière et d'épargne collective
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Section Darna */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🏠</div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Darna</h2>
              <p className="text-gray-600 mb-6">
                Gérez vos biens immobiliers, publiez vos annonces et trouvez des locataires facilement.
              </p>
              <button
                onClick={() => chooseAPI("darna")}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Explorer Darna
              </button>
            </div>

            {/* Section Tirelire */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-green-600 text-4xl mb-4">💰</div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tirelire</h2>
              <p className="text-gray-600 mb-6">
                Participez à des groupes d'épargne collective et atteignez vos objectifs financiers.
              </p>
              <button
                onClick={() => chooseAPI("tirelire")}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Explorer Tirelire
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Voir nos Plans
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              Créer un compte
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}