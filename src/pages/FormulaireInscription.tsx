import NavBar from "../componants/navBar";
import "../style/homeStyle.scss";
import "../style/FormulaireInscription.scss";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Image1.png";
import type { Race } from "../types/Race";
import useFetch from "../service/useFetch";

interface InscriptionForm {
  Prenom: string;
  Nom: string;
  mail: string;
  phone: string;
  sexe: string;
  DateNaissance: string;
}
interface InscriptionPayload {
  idRace: number | undefined;
  idUser: number | undefined; // à adapter selon ton système d'auth
  price: number | undefined;
}

export default function FormulaireInscription() {
  const location = useLocation();
  const navigate = useNavigate();
  const race = location.state?.race as Race | undefined;
  const { POST, GET } = useFetch();
  const [currentUser, setCurrentUser] = useState<{ idUser: number } | null>(
    null,
  );

  useEffect(() => {
    GET<{ idUser: number }>("/api/Login/me").then((data) => {
      if (data) setCurrentUser(data);
    });
  }, []);
  const [form, setForm] = useState<InscriptionForm>({
    Prenom: "",
    Nom: "",
    mail: "",
    phone: "",
    sexe: "",
    DateNaissance: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await POST<InscriptionPayload, { clientSecret: string }>(
        "/api/InscriptionCourse/initier-paiement",
        {
          idRace: race?.idRace,
          idUser: currentUser?.idUser,
          price: race?.price,
        },
      );

      navigate("/paiement", {
        state: {
          clientSecret: result?.clientSecret,
          race,
        },
      });
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div className="home-wrapper">
      <NavBar />

      <header className="home-hero">
        <h1 className="hero-title">
          Race<span>Portal</span>
        </h1>
      </header>

      <div className="home-main">
        <div className="home-content">
          {race && (
            <div className="form-race-info">
              <h2>{race.raceName}</h2>
              <p>
                {race.date} — {race.location}
              </p>
            </div>
          )}

          <form className="inscription-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Formulaire d'inscription</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Prenom">Prénom</label>
                <input
                  id="Prenom"
                  name="Prenom"
                  type="text"
                  value={form.Prenom}
                  onChange={handleChange}
                  placeholder="Jean"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Nom">Nom</label>
                <input
                  id="Nom"
                  name="Nom"
                  type="text"
                  value={form.Nom}
                  onChange={handleChange}
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mail">Mail</label>
              <input
                id="mail"
                name="mail"
                type="mail"
                value={form.mail}
                onChange={handleChange}
                placeholder="jean.dupont@mail.com"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="418 985 5451"
                />
              </div>
              <div className="form-group">
                <label htmlFor="DateNaissance">Date de naissance</label>
                <input
                  id="DateNaissance"
                  name="DateNaissance"
                  type="date"
                  value={form.DateNaissance}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="sexe">Sexe</label>
                <select
                  id="sexe"
                  name="sexe"
                  value={form.sexe}
                  onChange={handleSelectChange}
                  required
                >
                  <option value="" disabled>
                    Sélectionner&nbsp;&nbsp;&nbsp;
                  </option>
                  <option value="H">Homme</option>
                  <option value="F">Femme</option>
                </select>
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="form-btn">
              S'inscrire
            </button>
          </form>
        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-brand">
          <img src={logo} alt="RacePortal" className="footer-logo-img" />
          <span className="footer-logo-text">RacePortal</span>
        </div>
        <span className="footer-copyright">
          © {new Date().getFullYear()} RacePortal — Tous droits réservés
        </span>
      </footer>
    </div>
  );
}
