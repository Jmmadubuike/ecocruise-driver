"use client";
import { useAuth } from "@/context/AuthContext";

const ExpiryWarning = () => {
  const { showExpiryWarning } = useAuth();

  if (!showExpiryWarning) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg animate-pulse">
      ⚠️ Session expiring soon! Move your mouse or press a key to stay logged in.
    </div>
  );
};

export default ExpiryWarning;
