import React, { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium mb-1 text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <GoEyeClosed /> : <GoEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
