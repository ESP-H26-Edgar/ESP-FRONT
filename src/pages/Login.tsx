import { useState } from "react";
import useFetch from "../service/useFetch";
import "../style/loginStyle.scss";
import { Mail, Lock } from "lucide-react";

type MessageType = "success" | "error" | "";

export default function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("");
  const [loading, setLoading] = useState(false);
  const { POST } = useFetch();

  const handleLogin = async () => {
    if (!mail || !password) {
      setMessage("Veuillez remplir tous les champs");
      setMessageType("error");
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
      setMessageType("success");
      // window.location.href = "/dashboard";
    } catch (err: any) {
      console.log("status:", err.status);
      console.log("message:", err.message);
      try {
        const errors = JSON.parse(err.message);
        setMessage(errors[0]?.errorMessage || "Erreur de connexion");
      } catch {
        setMessage(err.message || "Erreur de connexion");
      }
      setMessageType("error");
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

        {message && (
          <p
            className={`login-message ${
              messageType === "success" ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
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
