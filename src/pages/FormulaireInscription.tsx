import NavBar from "../componants/navBar";
import "../style/Home.scss";
import "../style/FormulaireInscription.scss";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Image1.png";
import type { Race } from "../types/Race";
import useFetch from "../service/useFetch";
import { useAuthService } from "../service/authService";

interface InscriptionForm {
  Prenom: string;
  Nom: string;
  Mail: string;
  Phone: string;
  Sexe: string;
  DateNaissance: string;
}
interface InscriptionPayload {
  idRace: number | undefined;
  idUser: number | undefined;
  price: number | undefined;
}

export default function FormulaireInscription() {
  const location = useLocation();
  const navigate = useNavigate();
  const race = location.state?.race as Race | undefined;
  const { POST } = useFetch();
  const { getMe } = useAuthService();

  const [currentUser, setCurrentUser] = useState<{ idUser: number } | null>(
    null,
  );

  useEffect(() => {
    getMe().then((data) => {
      if (data) setCurrentUser(data);
    });
  }, []);
  const [form, setForm] = useState<InscriptionForm>({
    Prenom: "",
    Nom: "",
    Mail: "",
    Phone: "",
    Sexe: "",
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
    } catch (err: any) {
      console.log("Erreur complète :", err);
      setError(err?.message || "Erreur inconnue");
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
              <label htmlFor="Mail">Mail</label>
              <input
                id="Mail"
                name="Mail"
                type="Mail"
                value={form.Mail}
                onChange={handleChange}
                placeholder="jean.dupont@mail.com"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Phone">Téléphone</label>
                <input
                  id="Phone"
                  name="Phone"
                  type="tel"
                  value={form.Phone}
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
                <label htmlFor="Sexe">Sexe</label>
                <select
                  id="Sexe"
                  name="Sexe"
                  value={form.Sexe}
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
