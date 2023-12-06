import { createContext } from "react";

const RefreshContext = createContext({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export default RefreshContext;
