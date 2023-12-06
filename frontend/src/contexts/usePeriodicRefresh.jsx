import { useContext, useCallback, useState } from 'react';
import PeriodicRefreshContext from './PeriodicRefreshContext';

export const usePeriodicRefresh = () => useContext(PeriodicRefreshContext);

export const usePeriodicRefreshProvider = () => {
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

  return { subscribe, unsubscribe, subscribers };
};