import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardDarna from "./pages/DashboardDarna";
import DashboardTirelire from "./pages/DashboardTirelire";

export default function App() {
  return (
    <BrowserRouter>
      {" "}
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard-darna" element={<DashboardDarna />} />
          <Route path="/dashboard-tirelire" element={<DashboardTirelire />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
