import { Routes, Route, Navigate } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Inscription from "./pages/Inscription";
import VerifyLogin from "./componants/VerifyLogin";
import FormulaireInscription from "./pages/FormulaireInscription";
import PaiementPage from "./pages/PayementPage";
import PayementConfirmation from "./pages/payementConfirmation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<VerifyLogin />}>
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route
          path="/formulaireInscription"
          element={<FormulaireInscription />}
        />
        <Route path="/paiement" element={<PaiementPage />} />
        <Route
          path="/paiement/confirmation"
          element={<PayementConfirmation />}
        />
      </Route>
    </Routes>
  );
}

export default App;
