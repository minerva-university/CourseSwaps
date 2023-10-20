import "./App.css";
import AuthPage from "./views/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserformPage from "./views/userFormPage";

function App() {

  return (
    <BrowserRouter>
      <div>
        <h1>Course Swap</h1>
        <Routes>
          <Route path="/" element={<AuthPage/>}/>
          <Route path="/userform" element={<UserformPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
