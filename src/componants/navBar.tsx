import { Link } from "react-router-dom";
import logo from "../assets/Image1.png";

export default function navBar() {
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
          <Link to="/results">Résultats</Link>
        </li>
      </ul>
      <Link to="/login" className="nav-profile">
        ⚙️
      </Link>
    </nav>
  );
}
