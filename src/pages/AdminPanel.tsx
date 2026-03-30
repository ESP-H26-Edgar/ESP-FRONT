import NavBar from "../componants/navBar";
import "../style/Home.scss";
import "../style/Admin.scss";
import { useEffect, useState } from "react";
import logo from "../assets/Image1.png";
import type { Race } from "../types/Race";
import useFetch from "../service/useFetch";

export default function Admin() {
  const [courses, setCourses] = useState<Race[]>([]);
  const { GET, DELETE } = useFetch();

  useEffect(() => {
    GET<Race[]>("/api/Race").then((data) => {
      if (data) setCourses(data);
    });
  }, []);

  const handleDelete = async (idRace: number) => {
    if (!confirm("Supprimer cette course ?")) return;
    await DELETE(`/api/Race/${idRace}`);
    setCourses((prev) => prev.filter((c) => c.idRace !== idRace));
  };

  const prochaines = courses.slice(0, 3);

  //Merci à chat gpt pour l'affichage et la gestion des places réstantes
  const getStatut = (race: Race) => {
    const restantes = race.numberPlace;
    const ratio = restantes / race.numberPlace;
    if (ratio <= 0.05) return { label: "Complet", cls: "badge-red" };
    if (ratio <= 0.2) return { label: "Presque complet", cls: "badge-amber" };
    return { label: "Ouvert", cls: "badge-green" };
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
          {/* ── Cards places restantes ── */}
          <p className="admin-section-title">
            Places restantes — 3 prochaines courses
          </p>
          <div className="admin-cards-grid">
            {prochaines.map((race) => {
              const pct = Math.round(
                (race.numberPlace / race.numberPlace) * 100,
              );
              const fill =
                pct > 80 ? "#E24B4A" : pct > 60 ? "#BA7517" : "#1D9E75";
              return (
                <div className="admin-stat-card" key={race.idRace}>
                  <p className="admin-stat-label">{race.raceName}</p>
                  <p className="admin-stat-value">{race.numberPlace}</p>
                  <p className="admin-stat-sub">places restantes</p>
                  <div className="admin-progress-bar">
                    <div
                      className="admin-progress-fill"
                      style={{ width: `${pct}%`, background: fill }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Tableau gestion ── */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <span className="admin-table-title">Gestion des courses</span>
              <button
                className="admin-btn-primary"
                onClick={() => {
                  /* navigate vers formulaire ajout */
                }}
              >
                + Nouvelle course
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th>Places</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((race) => {
                  const statut = getStatut(race);
                  return (
                    <tr key={race.idRace}>
                      <td>{race.raceName}</td>
                      <td>{race.date}</td>
                      <td>{race.location}</td>
                      <td>{race.numberPlace}</td>
                      <td>{race.price} $CA</td>
                      <td>
                        <span className={`admin-badge ${statut.cls}`}>
                          {statut.label}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn">Modifier</button>
                          <button
                            className="admin-action-btn danger"
                            onClick={() => handleDelete(race.idRace)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
