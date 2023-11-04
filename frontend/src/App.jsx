import "./App.css";
import AuthPage from "./views/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserformPage from "./views/userFormPage";
import { UserProvider } from "./contexts/UserContext";
import ApiProvider from "./contexts/ApiProvider";

function App() {
  return (
    <ApiProvider>
      <UserProvider>
        <BrowserRouter>
            {/* <h1>Course Swap</h1> */}
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/userform" element={<UserformPage />} />
            </Routes>
        </BrowserRouter>
      </UserProvider>
    </ApiProvider>
  );
}

export default App;
