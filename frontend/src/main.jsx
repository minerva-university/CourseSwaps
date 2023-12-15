/* eslint-disable no-undef */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material/styles";
import basic_theme from "./themes/basic_theme.js";
import CssBaseline from "@mui/material/CssBaseline";

const googleClientId = window.GOOGLE_CLIENT_ID || "default_client_id";
console.log("googleClientId", googleClientId);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={basic_theme}>
    <CssBaseline />
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </ThemeProvider>,
);
