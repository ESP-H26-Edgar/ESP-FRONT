import NavBar from "../componants/navBar";
import "../style/Home.scss";
import "../style/FormulaireInscription.scss";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Race } from "../types/Race";
import useFetch from "../service/useFetch";
import Footer from "../componants/footer";

interface InscriptionForm {
  Prenom: string;
  Nom: string;
  AdresseMail: string;
  Phone: string;
  Sexe: string;
  DateNaissance: string;
}
interface InscriptionPayload {
  idRace: number | undefined;
  price: number | undefined;

  Prenom: string;
  Nom: string;
  AdresseMail: string;
  Phone: string;
  Sexe: string;
  DateNaissance: string;
}

export default function FormulaireInscription() {
  const location = useLocation();
  const navigate = useNavigate();
  const race = location.state?.race as Race | undefined;
  const { POST } = useFetch();

  const [form, setForm] = useState<InscriptionForm>({
    Prenom: "",
    Nom: "",
    AdresseMail: "",
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
          price: race?.price,

          Prenom: form.Prenom,
          Nom: form.Nom,
          AdresseMail: form.AdresseMail,
          Phone: form.Phone,
          Sexe: form.Sexe,
          DateNaissance: form.DateNaissance,
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
              <label htmlFor="AdresseMail">Mail</label>
              <input
                id="AdresseMail"
                name="AdresseMail"
                type="Mail"
                value={form.AdresseMail}
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

      <Footer />
    </div>
  );
}
