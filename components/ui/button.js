import React from "react";

export function Button({ children, className = "", variant = "default", ...props }) {
  // Basic TailwindCSS styles for variants
  let baseStyle = "px-4 py-2 rounded font-semibold focus:outline-none transition ";

  let variantStyle = "";
  switch (variant) {
    case "destructive":
      variantStyle = "bg-red-600 text-white hover:bg-red-700";
      break;
    case "outline":
      variantStyle = "border border-gray-300 text-gray-700 hover:bg-gray-100";
      break;
    default:
      variantStyle = "bg-indigo-600 text-white hover:bg-indigo-700";
  }

  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
}
