import React from "react";
import { AppContext } from "../contexts/appContext";

export function useAppContext() {
  const context = React.useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}
