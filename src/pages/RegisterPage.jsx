import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useState } from "react";
import Navbar from "../components/Navbar";
import FormDarna from "../components/FormDarna";
import FormTirelire from "../components/FormTirelire";
export default function Register() {
  const { state } = useLocation();
  const chosenPlan = state?.plan || null;
  const { register, chooseAPI } = useAuth();
  const { error } = useNotification();
  const [apiChoice, setApiChoice] = useState("darna");

  const handleRegister = async (data) => {
    chooseAPI(apiChoice); 
    try {
      await register({ ...data, planId: chosenPlan?._id || null });
    } catch (err) {
      error(err.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Créer un compte</h2>

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

        {chosenPlan && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            Plan choisi: <strong>{chosenPlan.name}</strong>
          </div>
        )}

        {apiChoice === "darna" ? (
          <FormDarna onSubmit={handleRegister} />
        ) : (
          <FormTirelire onSubmit={handleRegister} />
        )}
      </div>
      </div>
    </>
  );
}
