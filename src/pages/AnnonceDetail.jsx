import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProperties } from "../context/PropertyContext";

function AnnonceDetail() {
  const { id } = useParams();
  const { getPropertyByIdd } = useProperties(); // fonction publique

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPropertyByIdd(id);
        setProperty(data);
      } catch (err) {
        console.error("Erreur lors du chargement de la propriété :", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, getPropertyByIdd]);

  if (loading) return <p className="text-center">Chargement...</p>;
  if (!property) return <p className="text-center">Annonce introuvable</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Titre */}
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

      {/* Galerie d'images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {property.media?.images?.length > 0 ? (
          property.media.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Image ${i + 1}`}
              className="h-48 w-full object-cover rounded"
            />
          ))
        ) : (
          <img
            src="https://via.placeholder.com/400"
            alt="placeholder"
            className="h-48 w-full object-cover rounded"
          />
        )}
      </div>

      {/* Infos principales */}
      <div className="mb-4">
        <p className="text-gray-700 mb-1">
          💰 Prix: {property.price.toLocaleString()} MAD
        </p>
        <p className="text-gray-700 mb-1">📌 Type: {property.type}</p>
        <p className="text-gray-700 mb-1">
          📍 Adresse: {property.address?.street}, {property.address?.city}
        </p>
        <p className="text-gray-700 mb-1">
          {property.status === "à vendre" || property.status === "à louer"
            ? "✅ Disponible"
            : "❌ Indisponible"}
        </p>
      </div>

      {/* Description */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-600">{property.description}</p>
      </div>

      {/* Caractéristiques */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Caractéristiques</h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-700">
          {property.surface && <li>🏠 Surface: {property.surface} m²</li>}
          {property.rooms && <li>🛋 Pièces: {property.rooms}</li>}
          {property.bedrooms && <li>🛏 Chambres: {property.bedrooms}</li>}
          {property.characteristics?.bathrooms && (
            <li>🚿 Salles de bain: {property.characteristics.bathrooms}</li>
          )}
          {property.characteristics?.equipment?.length > 0 && (
            <li>
              ⚙ Équipements: {property.characteristics.equipment.join(", ")}
            </li>
          )}
          {property.characteristics?.rules?.length > 0 && (
            <li>📜 Règles: {property.characteristics.rules.join(", ")}</li>
          )}
          {property.characteristics?.energyRating && (
            <li>🔋 Énergie: {property.characteristics.energyRating}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AnnonceDetail;
