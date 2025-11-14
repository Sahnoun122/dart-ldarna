import { useState } from "react";
import ChoixPlateforme from "../components/ChoixPlateforme";
import FormLoginDarna from "../components/FormLoginDarna";
import FormLoginTirelire from "../components/FormLoginTirelire";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [choix, setChoix] = useState("darna");
  const { connecter } = useAuth();

  const submit = (data) => {
    connecter(choix, data);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Connexion</h1>

      <ChoixPlateforme choix={choix} setChoix={setChoix} />

      {choix === "darna" ? (
        <FormLoginDarna onSubmit={submit} />
      ) : (
        <FormLoginTirelire onSubmit={submit} />
      )}
    </div>
  );
}
