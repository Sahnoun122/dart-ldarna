import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProperties } from "../../context/PropertyContext"; 
import axios from "axios";

function PropertyDetail() {
  const { id } = useParams(); 
  const { getPropertyById } = useProperties();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.error("Erreur lors du chargement de la propriété:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id, getPropertyById]);

  if (loading) return <p>Chargement...</p>;
  if (!property) return <p>Propriété introuvable</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {property.media?.images?.length > 0 ? (
          property.media.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Image ${i + 1}`}
              className="w-full h-48 object-cover rounded"
            />
          ))
        ) : (
          <img
            src="https://via.placeholder.com/300"
            alt="placeholder"
            className="w-full h-48 object-cover rounded"
          />
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-700 mb-1">
          💰 Prix: {property.price.toLocaleString()} MAD
        </p>
        <p className="text-gray-700 mb-1">
          📌 Type: {property.transactionType}
        </p>
        <p className="text-gray-700 mb-1">
          📍 Adresse: {property.location.address}, {property.location.city}
        </p>
        <p className="text-gray-700 mb-1">
          {property.availability ? "✅ Disponible" : "❌ Indisponible"}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-600">{property.description}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Caractéristiques</h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-700">
          <li>🏠 Surface: {property.characteristics.surface} m²</li>
          <li>🛏 Chambres: {property.characteristics.bedrooms}</li>
          <li>🚿 Salles de bain: {property.characteristics.bathrooms}</li>
          <li>🛋 Pièces: {property.characteristics.rooms}</li>
          {property.characteristics.equipment?.length > 0 && (
            <li>
              ⚙ Équipements: {property.characteristics.equipment.join(", ")}
            </li>
          )}
          {property.characteristics.rules?.length > 0 && (
            <li>📜 Règles: {property.characteristics.rules.join(", ")}</li>
          )}
          {property.characteristics.energyRating && (
            <li>🔋 Énergie: {property.characteristics.energyRating}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default PropertyDetail;
