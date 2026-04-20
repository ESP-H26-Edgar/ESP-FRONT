import { useNavigate } from "react-router-dom";
import "../style/AccueilCourseComponant.scss";

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

  const isPastRace = (dateString: string) => {
    const today = new Date();
    const raceDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    raceDate.setHours(0, 0, 0, 0);

    return raceDate < today;
  };
  if (isPastRace(date)) return null;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  return (
    <div
      className="accueil-course-card"
      onClick={() => navigate(`/inscription#course-${idRace}`)}
    >
      <div className="accueil-course-card__image">
        {image ? (
          <img
            src={`https://raceportal.edwrdledgar.me/images/${image}`}
            alt={nom}
          />
        ) : (
          <svg
            viewBox="0 0 120 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="120" height="80" fill="rgba(15,23,42,0.6)" />
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
      <div className="accueil-course-card__info">
        <p className="accueil-course-card__name">{nom}</p>
        <p className="accueil-course-card__meta">{formatDate(date)}</p>
        <p className="accueil-course-card__meta">{lieu}</p>
      </div>
    </div>
  );
}
