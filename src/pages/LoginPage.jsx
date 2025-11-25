import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import Navbar from "../components/Navbar";
import FormLoginDarna from "../components/FormLoginDarna";
import FormLoginTirelire from "../components/FormLoginTirelire";


export default function Login() {
  const { login, chooseAPI } = useAuth();
  const { error } = useNotification();
  const [apiChoice, setApiChoice] = useState("darna");

  const handleLogin = async (data) => {
    chooseAPI(apiChoice);
    try {
      await login(data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      error("Erreur de connexion: " + errorMsg);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>

        <div className="mb-4 flex gap-2 justify-center">
          <button
            type="button"
            onClick={() => setApiChoice("darna")}
            className={`px-3 py-1 rounded ${
              apiChoice === "darna" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Darna
          </button>
          <button
            type="button"
            onClick={() => setApiChoice("tirelire")}
            className={`px-3 py-1 rounded ${
              apiChoice === "tirelire"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Tirelire
          </button>
        </div>

        {apiChoice === "darna" ? (
          <FormLoginDarna onSubmit={handleLogin} />
        ) : (
          <FormLoginTirelire onSubmit={handleLogin} />
        )}
      </div>
      </div>
    </>
  );
}
