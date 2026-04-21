import Carousel from "../componants/CarouselComponant";
import AccueilCourseComponant from "../componants/AccueilCourseComponant";
import AccueilResultComponant from "../componants/AcceuilResultComponant";
import NavBar from "../componants/navBar";
import Footer from "../componants/footer";
import "../style/Home.scss";
import { useEffect, useState } from "react";
import useFetch from "../service/useFetch";
import type { Race } from "../types/Race";

interface ResultDto {
  idResult: number;
  idRegistration: number;
  idRace: number;
  place: number;
  bibNumber: number;
  nom: string;
  prenom: string;
}

interface RaceResult {
  id: number;
  course: string;
  podium: [string, string, string];
  idRace: number;
}

export default function Accueil() {
  const [courses, setCourses] = useState<Race[]>([]);
  const [resultats, setResultats] = useState<RaceResult[]>([]);
  const { GET } = useFetch();

  useEffect(() => {
    GET<Race[]>("/api/Race").then((data) => {
      if (!data) return;
      setCourses(data);

      // Courses passées uniquement
      const pastRaces = data.filter((c) => new Date(c.date) < new Date());

      Promise.all(
        pastRaces.map((race) =>
          GET<ResultDto[]>(`/api/Result/race/${race.idRace}`).then(
            (results) => ({
              race,
              results: results ?? [],
            }),
          ),
        ),
      ).then((all) => {
        const formatted: RaceResult[] = all
          .filter(({ results }) => results.length > 0)
          .map(({ race, results }) => {
            const top3 = results.sort((a, b) => a.place - b.place).slice(0, 3);

            const podium = top3.map((r) => `${r.prenom} ${r.nom}`);

            // Compléter si moins de 3 résultats
            while (podium.length < 3) podium.push("—");

            return {
              id: race.idRace,
              course: race.raceName,
              podium: podium as [string, string, string],
              idRace: race.idRace,
            };
          });

        setResultats(formatted);
      });
    });
  }, []);

  return (
    <div className="home-wrapper">
      <NavBar />
      <header className="home-hero">
        <h1 className="hero-title">
          Race<span>Portal</span>
        </h1>
      </header>
      <main className="home-main">
        <div className="home-content">
          <section className="home-section">
            <h2 className="section-heading">Courses à venir :</h2>
            <Carousel
              items={courses}
              renderItem={(c) => (
                <AccueilCourseComponant
                  idRace={c.idRace}
                  key={c.idRace}
                  nom={c.raceName}
                  date={c.date}
                  lieu={c.location}
                  image={c.image}
                />
              )}
            />
          </section>
          <br />
          <section className="home-section">
            <h2 className="section-heading">Derniers résultats :</h2>
            {resultats.length === 0 ? (
              <p>Aucun résultat disponible.</p>
            ) : (
              <Carousel
                items={resultats}
                renderItem={(r) => (
                  <AccueilResultComponant
                    key={r.id}
                    course={r.course}
                    podium={r.podium}
                    idRace={r.idRace}
                  />
                )}
              />
            )}
          </section>
          <a href="#top" className="return-top">
            ↑ Return to top
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
