import { useState } from "react";
import { useProperties } from "../../context/PropertyContext";
import { useNotification } from "../../context/NotificationContext";
import ChampSaisie from "../../components/ChampSaisie";
import Modal from "../../components/Modal";
import ConfirmModal from "../../components/ConfirmModal";
import UploadLocal from "../../components/UploadLocal";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

export default function PropertiesPage() {
  const {
    properties,
    createProperty,
    deleteProperty,
    updateProperty,
    loading,
    getPropertyById,
  } = useProperties();

  const { success, error } = useNotification();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    propertyId: null,
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    transactionType: "vente",
    price: 0,
    availability: true,
    location: { address: "", city: "", latitude: 0, longitude: 0 },
    characteristics: {
      surface: 0,
      rooms: 0,
      bedrooms: 0,
      bathrooms: 0,
      equipment: "",
      rules: "",
      energyRating: "",
    },
    media: { images: [], videos: [] },
  });

  const change = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm({ ...form, [parent]: { ...form[parent], [child]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const propertyData = {
        ...form,
        characteristics: {
          ...form.characteristics,
          equipment: form.characteristics.equipment
            ? form.characteristics.equipment
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean)
            : [],
          rules: form.characteristics.rules
            ? form.characteristics.rules
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean)
            : [],
        },
      };

      if (editMode) {
        await updateProperty(editingProperty._id, propertyData);
        success("Annonce modifiée !");
      } else {
        await createProperty(propertyData);
        success("Annonce ajoutée !");
      }
      resetForm();
    } catch (err) {
      error("Erreur: " + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setOpen(false);
    setEditMode(false);
    setEditingProperty(null);
    setForm({
      title: "",
      description: "",
      transactionType: "vente",
      price: 0,
      availability: true,
      location: { address: "", city: "", latitude: 0, longitude: 0 },
      characteristics: {
        surface: 0,
        rooms: 0,
        bedrooms: 0,
        bathrooms: 0,
        equipment: "",
        rules: "",
        energyRating: "",
      },
      media: { images: [], videos: [] },
    });
  };

  const handleEdit = (property) => {
    setEditMode(true);
    setEditingProperty(property);
    setForm({
      title: property.title,
      description: property.description,
      transactionType: property.transactionType,
      price: property.price,
      availability: property.availability,
      location: property.location,
      characteristics: {
        surface: property.characteristics.surface,
        rooms: property.characteristics.rooms,
        bedrooms: property.characteristics.bedrooms,
        bathrooms: property.characteristics.bathrooms,
        equipment: property.characteristics.equipment?.join(", "),
        rules: property.characteristics.rules?.join(", "),
        energyRating: property.characteristics.energyRating,
      },
      media: property.media,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      success("Annonce supprimée !");
    } catch (err) {
      error("Erreur suppression : " + err.message);
    }
  };

  const confirmDeleteAction = (propertyId) => {
    setConfirmDelete({ isOpen: true, propertyId });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-2xl font-bold">Mes Annonces</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Ajouter une annonce
        </button>
      </div>

      {/* ---------- MODAL ---------- */}
      <Modal open={open} onClose={resetForm}>
        <h3 className="text-xl font-semibold mb-4">
          {editMode ? "Modifier l'annonce" : "Créer une annonce"}
        </h3>

        <form onSubmit={submit} className="space-y-6">
          <ChampSaisie
            label="Titre"
            name="title"
            value={form.title}
            onChange={change}
            required
          />
          <ChampSaisie
            label="Description"
            name="description"
            value={form.description}
            onChange={change}
          />
          <select
            name="transactionType"
            value={form.transactionType}
            onChange={change}
            className="w-full p-3 rounded border"
          >
            <option value="vente">Vente</option>
            <option value="location_journalière">Location journalière</option>
            <option value="location_mensuelle">Location mensuelle</option>
            <option value="location_longue">Location longue durée</option>
          </select>

          <ChampSaisie
            label="Prix"
            name="price"
            type="number"
            value={form.price}
            onChange={change}
          />

          <h4 className="text-lg font-semibold mt-4">Localisation</h4>
          <div className="grid grid-cols-2 gap-4">
            <ChampSaisie
              label="Adresse"
              name="location.address"
              value={form.location.address}
              onChange={change}
            />
            <ChampSaisie
              label="Ville"
              name="location.city"
              value={form.location.city}
              onChange={change}
            />
            <ChampSaisie
              label="Latitude"
              name="location.latitude"
              type="number"
              value={form.location.latitude}
              onChange={change}
            />
            <ChampSaisie
              label="Longitude"
              name="location.longitude"
              type="number"
              value={form.location.longitude}
              onChange={change}
            />
          </div>

          <h4 className="text-lg font-semibold mt-4">Caractéristiques</h4>
          <div className="grid grid-cols-3 gap-4">
            <ChampSaisie
              label="Surface"
              name="characteristics.surface"
              type="number"
              value={form.characteristics.surface}
              onChange={change}
            />
            <ChampSaisie
              label="Pièces"
              name="characteristics.rooms"
              type="number"
              value={form.characteristics.rooms}
              onChange={change}
            />
            <ChampSaisie
              label="Chambres"
              name="characteristics.bedrooms"
              type="number"
              value={form.characteristics.bedrooms}
              onChange={change}
            />
            <ChampSaisie
              label="Salles de bain"
              name="characteristics.bathrooms"
              type="number"
              value={form.characteristics.bathrooms}
              onChange={change}
            />
            <ChampSaisie
              label="Équipements"
              name="characteristics.equipment"
              value={form.characteristics.equipment}
              onChange={change}
            />
            <ChampSaisie
              label="Règles"
              name="characteristics.rules"
              value={form.characteristics.rules}
              onChange={change}
            />
            <ChampSaisie
              label="Énergie"
              name="characteristics.energyRating"
              value={form.characteristics.energyRating}
              onChange={change}
            />
          </div>

          <h4 className="text-lg font-semibold mt-4">Images</h4>
          <UploadLocal
            onUpload={(url) =>
              setForm((prev) => ({
                ...prev,
                media: { ...prev.media, images: [...prev.media.images, url] },
              }))
            }
          />

          <div className="flex gap-2 mt-3 flex-wrap">
            {form.media.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="preview"
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 hover:bg-blue-700 transition">
            {editMode ? "Modifier l'annonce" : "Créer l'annonce"}
          </button>
        </form>
      </Modal>

      {/* ---------- Liste des propriétés ---------- */}
      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : (
        <div className="grid gap-4">
          {properties.map((property) => (
            <div
              key={property._id}
              className="border rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row gap-4"
            >
              {/* Images */}
              <div className="flex gap-2 overflow-x-auto md:flex-col w-full md:w-48">
                {property.media?.images?.length > 0 ? (
                  property.media.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Image ${i + 1}`}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ))
                ) : (
                  <img
                    src="https://via.placeholder.com/150"
                    alt="placeholder"
                    className="w-24 h-24 object-cover rounded border"
                  />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-semibold">{property.title}</h3>
                <p className="text-gray-600 text-sm">{property.description}</p>
                <p className="text-gray-500 text-sm mt-1">
                  📍 {property.location.address}, {property.location.city}
                </p>
                <p className="text-gray-700 mt-1">
                  💰 Prix: {property.price.toLocaleString()} MAD
                </p>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <Link
                  to={`/properties/${property._id}`}
                  className="bg-green-500 text-white px-3 py-1 rounded text-center hover:bg-green-600 transition"
                >
                  Voir détails
                </Link>
                <button
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                  onClick={() => handleEdit(property)}
                >
                  Modifier
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => confirmDeleteAction(property._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, propertyId: null })}
        onConfirm={() => handleDelete(confirmDelete.propertyId)}
        title="Supprimer l'annonce"
        message="Voulez-vous vraiment supprimer cette annonce ?"
      />
      </div>
    </>
  );
}
