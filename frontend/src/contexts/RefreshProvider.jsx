import React, { useState, useCallback } from "react";
import RefreshContext from "./RefreshContext";

export const RefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(oldKey => oldKey + 1);
  }, []);

  return (
    <RefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
