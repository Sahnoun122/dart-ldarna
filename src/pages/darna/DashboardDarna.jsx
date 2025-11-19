import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function DashboardDarna() {
  const { logout } = useAuth();

  return (
    <>
      <h1 className="text-3xl text-center mt-10">
        Bienvenue dans Darna Dashboard
      </h1>

      <button
        onClick={logout}
        className="bg-red-600 text-white p-2 rounded mt-4"
      >
        Déconnexion
      </button>

      <div className="mt-6 text-center">
        <Link
          to="/properties"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Voir mes propriétés
        </Link>
      </div>
    </>
  );
}
