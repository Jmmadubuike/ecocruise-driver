"use client";

import { toast } from "react-hot-toast";

export const triggerToast = (message, type = "success") => {
  const baseStyle = {
    style: { borderRadius: "8px", padding: "12px 16px" },
    position: "top-right",
    duration: 3000,
  };

  if (type === "error") {
    toast.error(message, baseStyle);
  } else if (type === "loading") {
    return toast.loading(message, baseStyle);
  } else {
    toast.success(message, baseStyle);
  }
};
