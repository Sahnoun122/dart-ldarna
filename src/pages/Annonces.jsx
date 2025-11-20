import { useEffect, useState } from "react";
import { useProperties } from "../context/PropertyContext";
import { Link } from "react-router-dom";

function Annonces() {
  const { getAllProperties } = useProperties();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getAllProperties();
      setList(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="text-center">Chargement...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Toutes les annonces</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {list.map((p) => (
          <div
            key={p._id}
            className="border p-3 rounded shadow hover:shadow-lg"
          >
            <img
              src={p.media?.images?.[0] || "https://via.placeholder.com/300"}
              className="w-full h-48 object-cover rounded"
              alt={p.title}
            />

            <h2 className="text-xl font-semibold mt-3">{p.title}</h2>

            <p className="text-gray-700">
              {p.location?.city} — {p.price.toLocaleString()} MAD
            </p>

            <Link
              to={`/annonce/${p._id}`}
              className="text-blue-600 font-semibold mt-2 inline-block"
            >
              Voir détails →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Annonces;
