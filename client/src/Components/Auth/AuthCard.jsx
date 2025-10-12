import React from "react";

const AuthCard = ({ title, subtitle, children, footer }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-3">
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm sm:max-w-md">
        <h2 className="text-xl font-semibold text-center mb-1">{title}</h2>
        {subtitle && (
          <p className="text-center text-gray-500 text-sm mb-4">{subtitle}</p>
        )}
        <div className="space-y-3">{children}</div>
        {footer && (
          <div className="text-center mt-4 text-xs sm:text-sm text-gray-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
