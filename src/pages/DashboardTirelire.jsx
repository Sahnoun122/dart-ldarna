 import { useAuth } from "../context/AuthContext";

export default function DashboardTirelire() {
        const { deconnecter } = useAuth();

  return (
    <>
      <h1 className="text-3xl text-center mt-10">
        Bienvenue dans Tirelire Dashboard
      </h1>

      <button
        onClick={deconnecter}
        className="bg-red-600 text-white p-2 rounded mt-4"
      >
        Deconnections
      </button>
    </>
  );
}
