import { useAuth } from "../context/AuthContext";

export default function LoadingScreen() {
  const { isLoading } = useAuth();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement de votre session...</p>
      </div>
    </div>
  );
}