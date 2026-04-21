import { useNavigate } from "react-router-dom";

interface ResultCardProps {
  course: string;
  podium: [string, string, string];
}

export default function AccueilResultComponant({
  course,
  podium,
}: ResultCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="result-card"
      onClick={() => navigate("/results")}
      style={{ cursor: "pointer" }}
    >
      <div className="result-card-podium">
        <div className="podium-visual">
          <div className="podium-slot p2">
            <span className="podium-name">{podium[1]}</span>
            <div className="podium-bar p2">2</div>
          </div>
          <div className="podium-slot p1">
            <span className="podium-name">{podium[0]}</span>
            <div className="podium-bar p1">1</div>
          </div>
          <div className="podium-slot p3">
            <span className="podium-name">{podium[2]}</span>
            <div className="podium-bar p3">3</div>
          </div>
        </div>
      </div>
      <div className="result-card-info">
        <p className="result-name">Résultats de : {course}</p>
      </div>
    </div>
  );
}
