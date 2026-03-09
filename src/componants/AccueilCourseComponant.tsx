import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  idRace: number;
  nom: string;
  date: string;
  lieu: string;
  image?: string;
}

export default function AccueilCourseComponant({
  idRace,
  nom,
  date,
  lieu,
  image,
}: CourseCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className="course-card"
      onClick={() => navigate(`/inscription#course-${idRace}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="course-card-map">
        <div className="map-placeholder">
          {image ? (
            <img
              src={`https://raceportal.edwrdledgar.me/images/${image}`}
              alt={nom}
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          ) : (
            <svg
              viewBox="0 0 120 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 60 Q40 20 60 40 Q80 60 100 30"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M15 50 Q35 10 55 35 Q75 55 95 25"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="4 3"
              />
              <circle cx="20" cy="60" r="3" fill="#22c55e" />
              <circle cx="100" cy="30" r="3" fill="#ef4444" />
            </svg>
          )}
        </div>
      </div>
      <div className="course-card-info">
        <p className="course-name">{nom}</p>
        <p className="course-meta">{date}</p>
        <p className="course-meta">{lieu}</p>
      </div>
    </div>
  );
}
