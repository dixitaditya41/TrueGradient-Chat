import React from "react";
import { X } from "lucide-react";

const InviteModal = ({
  isOpen,
  onClose,
  title,
  inputLabel,
  inputValue,
  onInputChange,
  placeholder,
  confirmLabel = "Confirm",
  onConfirm,
  disableConfirm = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl w-[380px] shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        {/* Input Field */}
        {inputLabel && (
          <label className="text-sm text-gray-600 font-medium">
            {inputLabel}
          </label>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md p-2 mt-1 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Action Button */}
        <button
          onClick={onConfirm}
          disabled={disableConfirm}
          className={`w-full py-2 rounded-md text-white transition ${
            disableConfirm
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
