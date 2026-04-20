import { useEffect, useState } from "react";
import type { Race } from "../types/Race";
import type { Registration } from "../types/Registration";
import useFetch from "../service/useFetch";
import "../style/listeInscrit.scss";

export default function CourseList({ perPage = 3 }: { perPage?: number }) {
  const [courses, setCourses] = useState<Race[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedRace, setSelectedRace] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const { GET } = useFetch();

  useEffect(() => {
    GET<Race[]>("/api/Race").then((data) => {
      if (data) setCourses(data);
    });
    GET<Registration[]>("/api/InscriptionCourse").then((data) => {
      if (data) setRegistrations(data);
    });
  }, []);

  const totalPages = Math.ceil(courses.length / perPage);
  const visible = courses.slice(page * perPage, page * perPage + perPage);

  const handleClick = (idRace: number) => {
    setSelectedRace((prev) => (prev === idRace ? null : idRace));
  };

  const getInscrits = (idRace: number) => {
    const inscrits = registrations.filter((r) => r.idRace === idRace);
    if (!search.trim()) return inscrits;

    const query = search.trim().toLowerCase();
    return inscrits.filter(
      (r) =>
        r.nom?.toLowerCase().includes(query) ||
        r.prenom?.toLowerCase().includes(query),
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div className="course-list-wrapper">
      <h2 className="course-list-title">Liste des courses :</h2>

      {/* Barre de recherche */}
      <div className="course-search">
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="course-search-input"
        />
        {search && (
          <button className="course-search-clear" onClick={() => setSearch("")}>
            ✕
          </button>
        )}
      </div>

      <div className="course-list">
        {visible.map((course) => {
          const inscrits = getInscrits(course.idRace);
          const isOpen = selectedRace === course.idRace;

          return (
            <div key={course.idRace}>
              <div
                className={`course-card ${isOpen ? "course-card--active" : ""}`}
                onClick={() => handleClick(course.idRace)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <p className="course-name">{course.raceName}</p>
                  <p className="course-date">{formatDate(course.date)}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="course-badge">{course.kilometer} km</span>
                  <span className="course-badge">
                    {inscrits.length} inscrit(s)
                    {search && ` trouvé(s)`}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {isOpen && (
                <div className="course-inscrits">
                  {inscrits.length === 0 ? (
                    <p className="inscrits-empty">
                      {search
                        ? `Aucun résultat pour "${search}".`
                        : "Aucun inscrit pour cette course."}
                    </p>
                  ) : (
                    <table className="inscrits-table">
                      <thead>
                        <tr>
                          <th>Dossard</th>
                          <th>Nom</th>
                          <th>Prénom</th>
                          <th>Sexe</th>
                          <th>Date de naissance</th>
                          <th>Email</th>
                          <th>Téléphone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inscrits.map((r) => (
                          <tr key={r.idRegistration}>
                            <td>#{r.bibNumber}</td>
                            <td>{r.nom ?? "—"}</td>
                            <td>{r.prenom ?? "—"}</td>
                            <td>{r.sexe ?? "—"}</td>
                            <td>{r.dateNaissance ?? "—"}</td>
                            <td>{r.adresseMail ?? "—"}</td>
                            <td>{r.phone ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="course-list-pagination">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
            ←
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
