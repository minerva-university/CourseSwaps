import { useContext } from "react";
import RefreshContext from "./RefreshContext";

export const useRefresh = () => useContext(RefreshContext);
