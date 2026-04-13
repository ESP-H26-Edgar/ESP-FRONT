import logo from "../assets/Image1.png";

export default function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-brand">
        <img src={logo} alt="RacePortal" className="footer-logo-img" />
        <span className="footer-logo-text">RacePortal</span>
      </div>
      <span className="footer-copyright">
        © {new Date().getFullYear()} RacePortal — Tous droits réservés
      </span>
    </footer>
  );
}
