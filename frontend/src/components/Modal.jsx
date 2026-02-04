import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-lg w-full mx-4">
        <button
          className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-lg transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
