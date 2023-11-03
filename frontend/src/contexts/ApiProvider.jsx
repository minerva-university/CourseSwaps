import { createContext, useContext } from "react";
import SwapsApiClient from "../Hooks/ApiClient";

const ApiContext = createContext();

export default function ApiProvider({ children }) {
  const api = new SwapsApiClient();

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
