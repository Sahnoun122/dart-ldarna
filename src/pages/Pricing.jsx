import { useEffect, useState } from "react";
import { apiDarna } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiDarna
      .get("/plans/public")
      .then((res) => setPlans(res.data))
      .catch(console.error);
  }, []);

  const choose = (plan) => {
    navigate("/register", { state: { plan } });
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">Plans</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((p) => (
          <div key={p._id} className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {p.type} — {p.price} MAD
            </p>
            <ul className="mb-4 text-gray-700">
              {p.features?.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
            <button
              onClick={() => choose(p)}
              className="w-full py-2 bg-blue-600 text-white rounded"
            >
              Choisir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
