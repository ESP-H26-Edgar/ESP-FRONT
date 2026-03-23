import { useState } from "react";
import useFetch from "../service/useFetch";
import "../style/Login.scss";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { POST } = useFetch();

  const handleLogin = async () => {
    if (!mail || !password) {
      setMessage("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await POST<{ mail: string; password: string }, void>("/api/Login", {
        mail,
        password,
      });

      setMessage("Connexion réussie !");

      window.location.href = "/Accueil";
    } catch (err: any) {
      console.log("status:", err.status);
      console.log("message:", err.message);
      try {
        const errors = JSON.parse(err.message);
        setMessage(errors[0]?.errorMessage || "Erreur de connexion");
      } catch {
        setMessage(err.message || "Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Connexion</h2>

        <div className="input-group">
          <Mail size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Adresse email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <Lock size={18} className="input-icon" />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {message && <p>{message}</p>}
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </div>
  );
}
