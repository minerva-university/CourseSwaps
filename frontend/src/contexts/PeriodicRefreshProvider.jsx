import React, { useEffect } from 'react';
import PeriodicRefreshContext from './PeriodicRefreshContext';
import { usePeriodicRefreshProvider } from './usePeriodicRefresh';


export const PeriodicRefreshProvider = ({ children }) => {
  const { subscribe, unsubscribe, subscribers } = usePeriodicRefreshProvider();

  useEffect(() => {
    const interval = setInterval(() => {
      subscribers.forEach(callback => callback());
    }, 5000); // Refresh every 15 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [subscribers]);

  return (
    <PeriodicRefreshContext.Provider value={{ subscribe, unsubscribe }}>
      {children}
    </PeriodicRefreshContext.Provider>
  );
};

export default PeriodicRefreshProvider;
