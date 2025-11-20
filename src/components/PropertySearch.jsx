import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PropertySearch = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const searchProperties = async () => {
    setLoading(true);
    try {
      const params = {keyword , city , minPrice, maxPrice , minSurface, maxSurface , rooms, bedrooms, transactionType, equipment};
      if (keyword) params.keyword = keyword;
      if (city) params.city = city;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minSurface) params.minSurface = minSurface;
      if (maxSurface) params.maxSurface = maxSurface;
      if (rooms) params.rooms = rooms;
      if (bedrooms) params.bedrooms = bedrooms;
      if (transactionType) params.transactionType = transactionType;
      if (equipment) params.equipment = equipment;

      const res = await axios.get("/api/properties/search", { params });
      setProperties(res.data);
    } catch (err) {
      console.error("Erreur recherche :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchProperties();
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recherche de propriétés</h1>

      {/* 🔹 Formulaire de recherche */}
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

      {loading ? (
        <p>Chargement...</p>
      ) : properties.length === 0 ? (
        <p>Aucune propriété trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((p) => (
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
};

export default PropertySearch;
