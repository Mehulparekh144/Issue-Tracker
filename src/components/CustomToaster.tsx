"use client";
import React from "react";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

function CustomToaster() {
  const { theme } = useTheme();
  return <Toaster richColors />;
}

export default CustomToaster;
