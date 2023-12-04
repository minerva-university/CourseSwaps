// RefreshContext.js
import React, { createContext, useContext, useState, useCallback } from "react";

const RefreshContext = createContext({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const useRefresh = () => useContext(RefreshContext);

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

export default RefreshContext;
