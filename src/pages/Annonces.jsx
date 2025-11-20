import { useEffect, useState } from "react";
import { useProperties } from "../context/PropertyContext";
import { Link } from "react-router-dom";

function Annonces() {
  const { getAllProperties } = useProperties();

  // 🔹 Etats
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Inputs de recherche
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSurface, setMinSurface] = useState("");
  const [maxSurface, setMaxSurface] = useState("");
  const [rooms, setRooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [equipment, setEquipment] = useState("");

  // 🔹 Charger toutes les propriétés
  const loadProperties = async () => {
    setLoading(true);
    const data = await getAllProperties();
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const filtered = list.filter((p) => {
      const keywordMatch = keyword
        ? p.title.toLowerCase().includes(keyword.toLowerCase()) ||
          p.description.toLowerCase().includes(keyword.toLowerCase())
        : true;
      const cityMatch = city
        ? p.location.city.toLowerCase().includes(city.toLowerCase())
        : true;
      const minPriceMatch = minPrice ? p.price >= parseFloat(minPrice) : true;
      const maxPriceMatch = maxPrice ? p.price <= parseFloat(maxPrice) : true;
      const minSurfaceMatch = minSurface
        ? p.characteristics.surface >= parseFloat(minSurface)
        : true;
      const maxSurfaceMatch = maxSurface
        ? p.characteristics.surface <= parseFloat(maxSurface)
        : true;
      const roomsMatch = rooms
        ? p.characteristics.rooms === parseInt(rooms)
        : true;
      const bedroomsMatch = bedrooms
        ? p.characteristics.bedrooms === parseInt(bedrooms)
        : true;
      const transactionMatch = transactionType
        ? p.transactionType === transactionType
        : true;
      const equipmentMatch = equipment
        ? equipment
            .split(",")
            .every((eq) => p.characteristics.equipment.includes(eq.trim()))
        : true;

      return (
        keywordMatch &&
        cityMatch &&
        minPriceMatch &&
        maxPriceMatch &&
        minSurfaceMatch &&
        maxSurfaceMatch &&
        roomsMatch &&
        bedroomsMatch &&
        transactionMatch &&
        equipmentMatch
      );
    });

    setList(filtered);
    setLoading(false);
  };

  if (loading) return <p className="text-center">Chargement...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Toutes les annonces</h1>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Mot-clé"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Ville"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Prix min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Prix max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Surface min (m²)"
          value={minSurface}
          onChange={(e) => setMinSurface(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Surface max (m²)"
          value={maxSurface}
          onChange={(e) => setMaxSurface(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Pièces"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Chambres"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Type de transaction</option>
          <option value="vente">Vente</option>
          <option value="location_journalière">Location journalière</option>
          <option value="location_mensuelle">Location mensuelle</option>
          <option value="location_longue">Location longue durée</option>
        </select>
        <input
          type="text"
          placeholder="Équipements (séparés par ,)"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded font-semibold"
        >
          Rechercher
        </button>
      </form>

      {list.length === 0 ? (
        <p>Aucune propriété trouvée.</p>
      ) : (
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
      )}
    </div>
  );
}

export default Annonces;
