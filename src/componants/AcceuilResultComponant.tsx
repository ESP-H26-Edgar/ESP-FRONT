interface ResultCardProps {
  course: string;
  podium: [string, string, string];
}

export default function AccueilResultComponant({
  course,
  podium,
}: ResultCardProps) {
  return (
    <div className="result-card">
      <div className="result-card-podium">
        <div className="podium-visual">
          <div className="podium-bar p2">2</div>
          <div className="podium-bar p1">1</div>
          <div className="podium-bar p3">3</div>
        </div>
      </div>
      <div className="result-card-info">
        <p className="result-name">Résultats de : {course}</p>
        <p className="result-meta">🥇 {podium[0]}</p>
        <p className="result-meta">🥈 {podium[1]}</p>
        <p className="result-meta">🥉 {podium[2]}</p>
      </div>
    </div>
  );
}
