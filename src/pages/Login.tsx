import { useState } from "react";
import useFetch from "../service/useFetch";

export default function Login() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { POST } = useFetch();

  const handleLogin = async () => {
    try {
      const data = await POST("/api/Login", { mail, password });

      if (data) {
        setMessage(`Bienvenue ${data.mail}`);
      }
    } catch (err: any) {
      console.error(err);
      setMessage("Erreur d'identifiant");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />
      <br />
      <br />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleLogin}>Se connecter</button>
      <p>{message}</p>
    </div>
  );
}
