import "./App.css";
import AuthPage from "./views/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import UserformPage from "./views/userFormPage";
import ExchangePage from "./views/ExchangeCoursesPage";
import ApiProvider from "./contexts/ApiProvider";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <ApiProvider>
      <UserProvider>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<ExchangePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/userform" element={<UserformPage />} />
              <Route path="/navbar" element={<Navbar />} /> 
            </Routes>
        </BrowserRouter>
      </UserProvider>
    </ApiProvider>
  );
}

export default App;
