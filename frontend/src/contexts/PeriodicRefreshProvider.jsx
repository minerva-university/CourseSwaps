import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const PeriodicRefreshContext = createContext({
  subscribe: () => {},
  unsubscribe: () => {}
});

export const usePeriodicRefresh = () => useContext(PeriodicRefreshContext);

export const PeriodicRefreshProvider = ({ children }) => {
  const [subscribers, setSubscribers] = useState(new Set());

  const subscribe = useCallback((callback) => {
    setSubscribers((prev) => new Set(prev.add(callback)));
  }, []);

  const unsubscribe = useCallback((callback) => {
    setSubscribers((prev) => {
      const newSubscribers = new Set(prev);
      newSubscribers.delete(callback);
      return newSubscribers;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      subscribers.forEach(callback => callback());
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [subscribers]);

  return (
    <PeriodicRefreshContext.Provider value={{ subscribe, unsubscribe }}>
      {children}
    </PeriodicRefreshContext.Provider>
  );
};

export default PeriodicRefreshContext;
