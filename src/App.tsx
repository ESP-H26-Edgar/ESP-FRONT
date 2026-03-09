import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Inscription from "./pages/inscription";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/accueil" element={<Accueil />} />
      <Route path="/inscription" element={<Inscription />} />
    </Routes>
  );
}

export default App;
