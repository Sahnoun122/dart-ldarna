import { useState } from "react";

export default function FormLoginTirelire({ onSubmit }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const change = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={submit} className="space-y-3 border p-4 rounded-xl">
      <h2 className="text-lg font-semibold text-center">Connexion Tirelire</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={change}
        className="w-full border p-2 rounded"
      />

      <input
        type="password"
        name="password"
        placeholder="Mot de passe"
        onChange={change}
        className="w-full border p-2 rounded"
      />

      <button className="w-full bg-green-600 text-white p-2 rounded">
        Se connecter
      </button>
    </form>
  );
}
