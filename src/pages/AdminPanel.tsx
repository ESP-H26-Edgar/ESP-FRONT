import NavBar from "../componants/navBar";
import "../style/Home.scss";
import "../style/Admin.scss";
import { useEffect, useState } from "react";
import type { Race } from "../types/Race";
import type { Registration } from "../types/Registration";
import useFetch from "../service/useFetch";
import Footer from "../componants/footer";
import AddRace from "../componants/AddRace";
import UpdateRace from "../componants/UpdateRace";

export default function Admin() {
  const [courses, setCourses] = useState<Race[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const { GET, DELETE } = useFetch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  const isPastRace = (dateString: string) => {
    const today = new Date();
    const raceDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    raceDate.setHours(0, 0, 0, 0);

    return raceDate < today;
  };

  useEffect(() => {
    GET<Race[]>("/api/Race").then((data) => {
      if (data) setCourses(data);
    });
    GET<Registration[]>("/api/InscriptionCourse").then((data) => {
      if (data) setRegistrations(data);
    });
  }, []);

  const handleCreated = () => {
    GET<Race[]>("/api/Race").then((data) => {
      if (data) setCourses(data);
    });
  };

  const handleEdit = (race: Race) => {
    console.log("EDIT CLICK", race);
    setSelectedRace(race);
    setEditDrawerOpen(true);
  };

  const handleUpdated = () => {
    GET<Race[]>("/api/Race").then((data) => {
      if (data) setCourses(data);
    });
  };
  const getRegisteredCount = (idRace: number) =>
    registrations.filter((r) => r.idRace === idRace).length;

  const getPlacesRestantes = (race: Race) =>
    race.numberPlace - getRegisteredCount(race.idRace);

  const handleDelete = async (idRace: number) => {
    const inscrits = getRegisteredCount(idRace);
    if (inscrits > 0) {
      alert(
        `Impossible de supprimer cette course : ${inscrits} inscrit(s) sont enregistrés.`,
      );
      return;
    }
    if (!confirm("Supprimer cette course ?")) return;
    await DELETE(`/api/Race/${idRace}`);
    setCourses((prev) => prev.filter((c) => c.idRace !== idRace));
  };

  const upcoming = courses.filter((r) => !isPastRace(r.date));
  const past = courses.filter((r) => isPastRace(r.date));

  const prochaines = upcoming.slice(0, 3);

  const getStatut = (race: Race) => {
    const restantes = getPlacesRestantes(race);
    const ratio = restantes / race.numberPlace;
    //gestion des places restantes : couleur + status
    if (ratio <= 0) return { label: "Complet", couleur: "badge-red" };
    if (ratio <= 0.2)
      return { label: "Presque complet", couleur: "badge-amber" };
    return { label: "Ouvert", couleur: "badge-green" };
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
          <AddRace
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onCreated={handleCreated}
          />
          <UpdateRace
            open={editDrawerOpen}
            onClose={() => {
              setEditDrawerOpen(false);
              setSelectedRace(null);
            }}
            onUpdated={handleUpdated}
            race={selectedRace}
            
          />
          <p className="admin-section-title">
            Places restantes — 3 prochaines courses
          </p>
          <div className="admin-cards-grid">
            {prochaines.map((race) => {
              const restantes = getPlacesRestantes(race);
              const placeRestantes = Math.round(
                (restantes / race.numberPlace) * 100,
              );
              const fill =
                placeRestantes <= 0
                  ? "#E24B4A"
                  : placeRestantes <= 20
                    ? "#BA7517"
                    : "#1D9E75";

              return (
                <div className="admin-stat-card" key={race.idRace}>
                  <p className="admin-stat-label">{race.raceName}</p>
                  <p className="admin-stat-value">{restantes}</p>
                  <p className="admin-stat-sub">
                    places restantes / {race.numberPlace}
                  </p>
                  <div className="admin-progress-bar">
                    <div
                      className="admin-progress-fill"
                      style={{
                        width: `${Math.max(0, placeRestantes)}%`,
                        background: fill,
                      }}
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
                onClick={() => setDrawerOpen(true)}
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
                  <th>Places totales</th>
                  <th>Inscrits</th>
                  <th>Restantes</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((race) => {
                  const statut = getStatut(race);
                  const inscrits = getRegisteredCount(race.idRace);
                  const restantes = getPlacesRestantes(race);
                  return (
                    <tr key={race.idRace}>
                      <td>{race.raceName}</td>
                      <td>{new Date(race.date).toLocaleString("fr")}</td>
                      <td>{race.location}</td>
                      <td>{race.numberPlace}</td>
                      <td>{inscrits}</td>
                      <td>{restantes}</td>
                      <td>{race.price} $CA</td>
                      <td>
                        <span className={`admin-badge ${statut.couleur}`}>
                          {statut.label}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-action-btn"
                            onClick={() => handleEdit(race)}
                          >
                            Modifier
                          </button>
                          <button
                            className="admin-action-btn danger"
                            onClick={() => handleDelete(race.idRace)}
                            disabled={getRegisteredCount(race.idRace) > 0}
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
          <div className="admin-table-card">
            <div className="admin-table-header">
              <span className="admin-table-title">Courses passées</span>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th>Inscrits</th>
                  <th>Places</th>
                  <th>Prix</th>
                </tr>
              </thead>

              <tbody>
                {past.map((race) => {
                  const inscrits = getRegisteredCount(race.idRace);

                  return (
                    <tr key={race.idRace}>
                      <td>{race.raceName}</td>
                      <td>{new Date(race.date).toLocaleString("fr")}</td>
                      <td>{race.location}</td>
                      <td>{inscrits}</td>
                      <td>{race.numberPlace}</td>
                      <td>{race.price} $CA</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
