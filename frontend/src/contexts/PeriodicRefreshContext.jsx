import { createContext } from 'react';

const PeriodicRefreshContext = createContext({
  subscribe: () => {},
  unsubscribe: () => {}
});

export default PeriodicRefreshContext;
