import { useState } from "react";

export default function FormDarna({onSubmit}){
    const [data, setData] = useState({
      username: "",
      email: "",
      password: "",
      role: "regulier",
    });


    const change= (e)=>{
        setData({...data, [e.target.name] : e.target.value})
    }

    const submit = (e)=>{
        e.preventDefault();
        onSubmit(data);
    }

    return (
      <form onSubmit={submit} className="space-y-3 border p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Inscription Darna
        </h2>

        <input
          type="text"
          name="username "
          placeholder="nom d'utilisateur"
          change={change}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="entre email"
          change={change}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="entre le mot de passe"
          change={change}
          className="w-full border p-2 rounded"
        />

        <select
          name="role"
          change={change}
          placeholder="choix"
          className="w-full border p-2 rounded"
        >
          <option value="regulier">regulier</option>
          <option value="entreprise">Entreprise</option>
        </select>

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          S’inscrire
        </button>
      </form>
    );
}