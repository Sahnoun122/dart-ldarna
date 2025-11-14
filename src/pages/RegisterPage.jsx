import { useState } from "react";
import ChoixPlateforme from "../components/ChoixPlateforme";
import FormDarna from "../components/FormDarna";
import FormTirelire from "../components/FormTirelire";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [choix, setChoix] = useState("darna");
  const { enregistrer } = useAuth();

  const submit = (data) => {
    enregistrer(data, choix);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Créer un compte</h1>

      <ChoixPlateforme choix={choix} setChoix={setChoix} />

      {choix === "darna" ? (
        <FormDarna onSubmit={submit} />
      ) : (
        <FormTirelire onSubmit={submit} />
      )}
    </div>
  );
}
