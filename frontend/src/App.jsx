import "./App.css";
import AuthPage from "./views/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserformPage from "./views/userFormPage";
import { UserProvider } from "./contexts/UserContext";
import ApiProvider from "./contexts/ApiProvider";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <ApiProvider>
      <UserProvider>
        <BrowserRouter>
            {/* <h1>Course Swap</h1> */}
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/userform" element={<UserformPage />} />
              <Route path="/navbar" element={<Navbar />} /> 
            </Routes>
        </BrowserRouter>
      </UserProvider>
    </ApiProvider>
  );
}

export default App;
