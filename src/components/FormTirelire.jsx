import { useState } from "react";

export default function FormTirelire ({ onSubmit}){
    const [data , setData] = useState({
        firstName: "",
        lastName : "",
        email : "",
        password: "",
        role: "particulier",
        national_id : "",
    });

 const change = (e) => {
   setData({ ...data, [e.target.name]: e.target.value });
 };

    const submit = (e)=>{
        e.preventDefault();
        onSubmit(data)
    };

    return (
      <form onSubmit={submit} className="space-y-3 border p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-2 text-center">
          Inscription Tirelire
        </h2>

        <input
          type="text"
          name="firstName"
          placeholder="Prénom"
          onChange={change}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="lastName"
          placeholder="Nom"
          onChange={change}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Adresse e-mail"
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

        <input
          type="text"
          name="national_id"
          placeholder="Identifiant national"
          onChange={change}
          className="w-full border p-2 rounded"
        />

        <select
          name="role"
          onChange={change}
          className="w-full border p-2 rounded"
        >
          <option value="particulier">Particulier</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-green-600 text-white p-2 rounded">
          S’inscrire
        </button>
      </form>
    );
}