import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/CourseListeRegister.scss";
import type { Race } from "../types/Race";

interface CourseListProps {
  courses: Race[];
  perPage?: number;
}

export default function CourseListRegister({
  courses,
  perPage = 3,
}: CourseListProps) {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const totalPages = Math.ceil(courses.length / perPage);
  const visible = courses.slice(page * perPage, page * perPage + perPage);
  console.log("visible:", visible);
  return (
    <div className="course-list-wrapper">
      <h2 className="course-list-title">Liste des courses :</h2>

      <div className="course-list">
        {visible.map((course) => (
          <div
            className="course-row"
            key={course.idRace}
            id={`course-${course.idRace}`}
          >
            {/* Image circuit */}
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

            {/* Infos */}
            <div className="course-row-info">
              <h3 className="course-row-name">{course.raceName}</h3>
              <div className="course-row-meta">
                <span>📅 {course.date}</span>
                <span>📍 {course.location}</span>
                <span>🗺️ {course.kilometer}km</span>
              </div>
              <p className="course-row-desc">{course.description}</p>
              <p className="course-row-desc">
                Nombre de places : {course.numberPlace}
              </p>
              <br />{" "}
              <button
                className="course-register-btn"
                onClick={() =>
                  navigate("/formulaireinscription", {
                    state: { race: course },
                  })
                }
              >
                S'inscrire à la course
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
