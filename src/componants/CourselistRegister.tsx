import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CourseListeRegister.scss";
import type { Race } from "../types/Race";

interface CourseListProps {
  courses: Race[];
  perPage?: number;
  registeredCounts?: Record<number, number>;
}

export default function CourseListRegister({
  courses,
  perPage = 3,
  registeredCounts = {},
}: CourseListProps) {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const isUpcomingRace = (dateString: string) => {
    const today = new Date();
    const raceDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    raceDate.setHours(0, 0, 0, 0);

    return raceDate >= today;
  };
  const filteredCourses = courses.filter((c) => isUpcomingRace(c.date));

  const totalPages = Math.ceil(filteredCourses.length / perPage);

  const visible = filteredCourses.slice(
    page * perPage,
    page * perPage + perPage,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr");
  };

  return (
    <div className="course-list-wrapper">
      <h2 className="course-list-title">Liste des courses :</h2>

      <div className="course-list">
        {visible.map((course) => {
          const placesRestantes =
            course.numberPlace - (registeredCounts[course.idRace] ?? 0);
          const isComplet = placesRestantes <= 0;

          return (
            <div
              className="course-row"
              key={course.idRace}
              id={`course-${course.idRace}`}
            >
              <div className="course-row-image">
                {course.image ? (
                  <img
                    src={`https://raceportal.edwrdledgar.me/images/${course.image}`}
                    alt={`Circuit ${course.raceName}`}
                  />
                ) : (
                  <div className="course-row-map-placeholder">
                    <svg
                      viewBox="0 0 200 140"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="200"
                        height="140"
                        fill="rgba(15,23,42,0.4)"
                        rx="8"
                      />
                      <path
                        d="M30 110 Q50 40 90 70 Q130 100 160 50 Q175 30 180 60"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <path
                        d="M30 110 Q50 40 90 70 Q130 100 160 50 Q175 30 180 60"
                        stroke="#22c55e"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray="6 4"
                        opacity="0.6"
                      />
                      <circle cx="30" cy="110" r="5" fill="#22c55e" />
                      <circle cx="180" cy="60" r="5" fill="#ef4444" />
                      <text
                        x="20"
                        y="128"
                        fill="rgba(255,255,255,0.4)"
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        START
                      </text>
                      <text
                        x="165"
                        y="52"
                        fill="rgba(255,255,255,0.4)"
                        fontSize="8"
                        fontFamily="monospace"
                      >
                        END
                      </text>
                    </svg>
                  </div>
                )}
              </div>

              <div className="course-row-info">
                <h3 className="course-row-name">{course.raceName}</h3>
                <div className="course-row-meta">
                  <span>📅 {formatDate(course.date)}</span>
                  <span>📍 {course.location}</span>
                  <span>🗺️ {course.kilometer}km</span>
                </div>
                <p className="course-row-desc">{course.description}</p>
                <p className="course-row-desc">
                  Places restantes : {Math.max(0, placesRestantes)} /{" "}
                  {course.numberPlace}
                </p>
                <br />
                <button
                  className="course-register-btn"
                  disabled={isComplet}
                  onClick={() => {
                    if (!isComplet) {
                      navigate("/formulaireinscription", {
                        state: { race: course },
                      });
                    }
                  }}
                >
                  {isComplet ? "Complet" : "S'inscrire à la course"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="course-list-pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
          >
            ←
          </button>
          <span className="pagination-info">
            {page + 1} / {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
          >
            →
          </button>
        </div>
      )}

      <a href="#top" className="return-top">
        Return to top
      </a>
    </div>
  );
}
