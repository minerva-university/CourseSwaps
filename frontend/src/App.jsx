import "./App.css";
import AuthPage from "./views/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import UserformPage from "./components/UserForm/Userform";
import ExchangePage from "./views/ExchangeCoursesPage";
import ApiProvider from "./contexts/ApiProvider";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <ApiProvider>
      <UserProvider>
        <BrowserRouter>
          <Navbar />
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
