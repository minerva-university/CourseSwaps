/* eslint-disable no-undef */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material/styles";
import basic_theme from "./themes/basic_theme.js";
import CssBaseline from "@mui/material/CssBaseline";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  window.GOOGLE_CLIENT_ID ||
  "default_client_id";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={basic_theme}>
    <CssBaseline />
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </ThemeProvider>
);
