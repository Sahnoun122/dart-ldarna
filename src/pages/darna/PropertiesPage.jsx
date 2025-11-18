import { useState } from "react";
import { useProperties } from "../../context/PropertyContext";
import { useNotification } from "../../context/NotificationContext";
import ChampSaisie from "../../components/ChampSaisie";
import Modal from "../../components/Modal";
import ConfirmModal from "../../components/ConfirmModal";
import { p } from "framer-motion/m";

export default function PropertiesPage() {
  const {
    properties,
    createProperty,
    deleteProperty,
    updateProperty,
    loading,
  } = useProperties();

  const { success, error } = useNotification();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, propertyId: null });

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
    media: { images: "", videos: "" },
  });

  const change = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm({
        ...form,
        [parent]: {
          ...form[parent],
          [child]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      // Préparation des données selon le format attendu par le backend
      const propertyData = {
        ...form,
        characteristics: {
          ...form.characteristics,
          equipment: form.characteristics.equipment 
            ? form.characteristics.equipment.split(',').map(item => item.trim()).filter(item => item)
            : [],
          rules: form.characteristics.rules 
            ? form.characteristics.rules.split(',').map(item => item.trim()).filter(item => item)
            : []
        },
        media: {
          images: form.media.images 
            ? form.media.images.split(',').map(url => url.trim()).filter(url => url)
            : [],
          videos: form.media.videos 
            ? form.media.videos.split(',').map(url => url.trim()).filter(url => url)
            : []
        }
      };

      if (editMode) {
        await updateProperty(editingProperty._id, propertyData);
        success("Annonce modifiée avec succès !");
      } else {
        await createProperty(propertyData);
        success("Annonce ajoutée avec succès !");
      }
      
      resetForm();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          "Une erreur inconnue s'est produite";
      
      error(`Erreur: ${errorMessage}`);
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
      media: { images: "", videos: "" },
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
      location: {
        address: property.location.address || "",
        city: property.location.city || "",
        latitude: property.location.latitude || 0,
        longitude: property.location.longitude || 0,
      },
      characteristics: {
        surface: property.characteristics.surface || 0,
        rooms: property.characteristics.rooms || 0,
        bedrooms: property.characteristics.bedrooms || 0,
        bathrooms: property.characteristics.bathrooms || 0,
        equipment: property.characteristics.equipment ? property.characteristics.equipment.join(", ") : "",
        rules: property.characteristics.rules ? property.characteristics.rules.join(", ") : "",
        energyRating: property.characteristics.energyRating || "",
      },
      media: {
        images: property.media.images ? property.media.images.join(", ") : "",
        videos: property.media.videos ? property.media.videos.join(", ") : "",
      },
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      success("Annonce supprimée avec succès !");
    } catch (err) {
      error("Erreur lors de la suppression: " + (err.response?.data?.message || err.message));
    }
  };

  const confirmDeleteAction = (propertyId) => {
    setConfirmDelete({ isOpen: true, propertyId });
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Mes Annonces</h2>

        <button
          onClick={() => {
            setEditMode(false);
            setEditingProperty(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Ajouter une annonce
        </button>
      </div>

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
            placeholder="Titre de l'annonce"
            required
          />
          <ChampSaisie
            label="Description"
            name="description"
            value={form.description}
            onChange={change}
            placeholder="Description..."
          />

          <div className="space-y-3">
            <label className="block text-orange-200 font-semibold text-lg">
              Type de transaction
            </label>
            <select
              name="transactionType"
              value={form.transactionType}
              onChange={change}
              className="w-full px-4 py-4 bg-black/50 border border-orange-500/30 rounded-xl text-white text-lg placeholder-orange-300/50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 hover:border-orange-400/60"
            >
              <option value="vente">Vente</option>
              <option value="location_journalière">Location journalière</option>
              <option value="location_mensuelle">Location mensuelle</option>
              <option value="location_longue">Location longue durée</option>
            </select>
          </div>

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
              label="Surface (m²)"
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
              placeholder="wifi, clim..."
            />
            <ChampSaisie
              label="Règles"
              name="characteristics.rules"
              value={form.characteristics.rules}
              onChange={change}
              placeholder="no smoking..."
            />
            <ChampSaisie
              label="Énergie"
              name="characteristics.energyRating"
              value={form.characteristics.energyRating}
              onChange={change}
            />
          </div>

          <h4 className="text-lg font-semibold mt-4">Médias</h4>
          <ChampSaisie
            label="Images (URLs séparées par virgules)"
            name="media.images"
            value={form.media.images}
            onChange={change}
          />
          <ChampSaisie
            label="Vidéos (URLs)"
            name="media.videos"
            value={form.media.videos}
            onChange={change}
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4">
            {editMode ? "Modifier l'annonce" : "Créer l'annonce"}
          </button>
        </form>
      </Modal>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="text-lg">Chargement des annonces...</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {properties.map((property) => (
            <div key={property._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{property.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="bg-blue-100 px-2 py-1 rounded">
                      {property.transactionType}
                    </span>
                    <span className="font-semibold text-lg text-green-600">
                      {property.price.toLocaleString()} MAD
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    📍 {property.location.address}, {property.location.city}
                  </p>
                  {property.characteristics && (
                    <div className="flex gap-4 text-sm text-gray-500 mt-2">
                      <span>🏠 {property.characteristics.surface} m²</span>
                      <span>🚪 {property.characteristics.rooms} pièces</span>
                      <span>🛏️ {property.characteristics.bedrooms} chambres</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(property)}
                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => confirmDeleteAction(property._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune annonce trouvée. Créez votre première annonce !
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, propertyId: null })}
        onConfirm={() => handleDelete(confirmDelete.propertyId)}
        title="Supprimer l'annonce"
        message="Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible."
      />
    </div>
  );
}
