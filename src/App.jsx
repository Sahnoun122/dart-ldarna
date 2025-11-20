import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardDarna from "./pages/darna/DashboardDarna";
import DashboardTirelire from "./pages/tirelire/DashboardTirelire";
import Pricing from "./pages/Pricing";
import Home from "./pages/Home";
import PropertiesPage from "./pages/darna/PropertiesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationContainer from "./components/NotificationContainer";
import PropertyDetail from "./pages/darna/PropertyDetail";

import Annonces from "./pages/Annonces";
import AnnonceDetail from "./pages/AnnonceDetail";
export default function App() {
  return (
    <>
      <NotificationContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard-darna"
          element={
            <ProtectedRoute>
              <DashboardDarna />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-tirelire"
          element={
            <ProtectedRoute>
              <DashboardTirelire />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <PropertiesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/annonces" element={<Annonces />} />
        <Route path="/annonce/:id" element={<AnnonceDetail />} />
      </Routes>
    </>
  );
}
