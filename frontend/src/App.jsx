import "./App.css";
import AuthPage from "./views/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import UserformPage from "./components/UserForm/UserForm";
import ExchangePage from "./views/ExchangeCoursesPage";
import AdminPage from "./views/AdminPage";
import ApiProvider from "./contexts/ApiProvider";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Box } from "@mui/material";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "100vh",
            }}
          >
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ExchangePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/userform"
                element={
                  <ProtectedRoute>
                    <UserformPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
