import { Routes, Route, Navigate } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Inscription from "./pages/Inscription";
import FormulaireInscription from "./pages/FormulaireInscription";
import PaiementPage from "./pages/PayementPage";
import PayementConfirmation from "./pages/payementConfirmation";
import Login from "./pages/Login";
import Admin from "./pages/AdminPanel";
import ListeInscrit from "./pages/ListeInscrit";
import ProtectedRoute from "./ProtectedRoute";

import Results from "./pages/Result";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Accueil" replace />} />

      <Route path="/Accueil" element={<Accueil />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route
        path="/formulaireInscription"
        element={<FormulaireInscription />}
      />
      <Route path="/paiement" element={<PaiementPage />} />
      <Route path="/paiement/confirmation" element={<PayementConfirmation />} />
      <Route path="/login" element={<Login />}></Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route path="/inscrits" element={<ListeInscrit />}></Route>
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;
