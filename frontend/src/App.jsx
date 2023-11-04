import "./App.css";
import AuthPage from "./views/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import UserformPage from "./views/userFormPage";
import ExchangePage from "./views/ExchangeCoursesPage";
import ApiProvider from "./contexts/ApiProvider";

function App() {
  return (
    <ApiProvider>
      <UserProvider>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<ExchangePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/userform" element={<UserformPage />} />
            </Routes>
        </BrowserRouter>
      </UserProvider>
    </ApiProvider>
  );
}

export default App;
