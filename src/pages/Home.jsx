import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { chooseAPI } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-4">Dart & Darna</h1>
      <p className="mb-6 text-center">
        Plateforme de gestion des annonces et d’épargne collective
      </p>

      <div className="space-x-4 mb-6">
        <button
          onClick={() => chooseAPI("darna")}
          className="px-5 py-3 bg-blue-600 text-white rounded"
        >
          Darna
        </button>
        <button
          onClick={() => chooseAPI("tirelire")}
          className="px-5 py-3 bg-green-600 text-white rounded"
        >
          Tirelire
        </button>
      </div>

      <div className="space-x-4">
        <Link
          to="/pricing"
          className="px-5 py-3 bg-blue-600 text-white rounded"
        >
          Voir les plans
        </Link>
        <Link to="/register" className="px-5 py-3 bg-gray-200 rounded">
          S’inscrire
        </Link>
        <Link to="/login" className="px-5 py-3 bg-green-200 rounded">
          Connexion
        </Link>
      </div>
    </div>
  );
}
