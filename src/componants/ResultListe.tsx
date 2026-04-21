import { useEffect, useState } from "react";
import type { Race } from "../types/Race";
import useFetch from "../service/useFetch";
import "../style/listeInscrit.scss";

interface ResultDto {
  idResult: number;
  idRegistration: number;
  idRace: number;
  place: number;
  bibNumber: number;
  nom: string;
  prenom: string;
}
export default function ResultList({ perPage = 3 }: { perPage?: number }) {
  const [courses, setCourses] = useState<Race[]>([]);
  const [results, setResults] = useState<ResultDto[]>([]);
  const [selectedRace, setSelectedRace] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const { GET } = useFetch();

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
  }, []);

  const handleClick = (idRace: number) => {
    if (selectedRace === idRace) {
      setSelectedRace(null);
      return;
    }
    setSelectedRace(idRace);
    GET<ResultDto[]>(`/api/Result/race/${idRace}`).then((data) => {
      if (data) {
        setResults((prev) => [
          ...prev.filter((r) => r.idRace !== idRace),
          ...data,
        ]);
      }
    });
  };

  const getResults = (idRace: number) =>
    results.filter((r) => r.idRace === idRace);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const getMedal = (place: number) => {
    if (place === 1) return "🥇";
    if (place === 2) return "🥈";
    if (place === 3) return "🥉";
    return `${place}e`;
  };

  const pastCourses = courses.filter((c) => isPastRace(c.date));
  const totalPages = Math.ceil(pastCourses.length / perPage);
  const visible = pastCourses.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="course-list-wrapper">
      <h2 className="course-list-title">Résultats par course :</h2>

      <div className="course-list">
        {visible.map((course) => {
          const courseResults = getResults(course.idRace);
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
                    {isOpen
                      ? `${courseResults.length} résultat(s)`
                      : "Voir résultats"}
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
                  {courseResults.length === 0 ? (
                    <p className="inscrits-empty">
                      Aucun résultat pour cette course.
                    </p>
                  ) : (
                    <table className="inscrits-table">
                      <thead>
                        <tr>
                          <th>Place</th>
                          <th>Dossard</th>
                          <th>Nom</th>
                          <th>Prénom</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseResults.map((r) => (
                          <tr key={r.idResult}>
                            <td>{getMedal(r.place)}</td>
                            <td>#{r.bibNumber}</td>
                            <td>{r.nom}</td>
                            <td>{r.prenom}</td>
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
