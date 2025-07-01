"use client";

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#004aad]">{title}</h3>
          <button
            onClick={onClose}
            className="text-red-500 font-bold text-xl hover:text-red-700"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
