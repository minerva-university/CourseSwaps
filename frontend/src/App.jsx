import "./App.css";
import AuthPage from "./views/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import UserformPage from "./components/UserForm/UserForm";
import ExchangePage from "./views/ExchangeCoursesPage";
import ApiProvider from "./contexts/ApiProvider";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <ApiProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<ExchangePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/userform" element={<UserformPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ApiProvider>
  );
}

export default App;
