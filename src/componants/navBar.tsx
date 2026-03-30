import { Link } from "react-router-dom";
import logo from "../assets/Image1.png";
import { useAuthService, type CurrentUser } from "../service/authService";
import { useEffect, useState } from "react";

export default function navBar() {
  const { getMe } = useAuthService();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getMe().then((data) => {
      if (data) setCurrentUser(data);
    });
  }, []);
  return (
    <nav className="home-nav">
      <Link to="/Accueil" className="nav-logo-icon">
        <img src={logo} alt="RacePortal" className="footer-logo-img" />
      </Link>
      <ul className="nav-links">
        <li>
          <Link to="/inscription">Inscription</Link>
        </li>
        <li>
          <Link to="/inscrits">Liste des inscrits</Link>
        </li>
        <li>
          <Link to="/resultats">Résultats</Link>
        </li>
      </ul>
      <div className="nav-profile">
        {currentUser?.role === "Admin" ? (
          <Link to="/adminPanel">⚙️</Link>
        ) : (
          <span>{currentUser?.role}</span>
        )}
      </div>
    </nav>
  );
}
