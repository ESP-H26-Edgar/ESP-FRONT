import Carousel from "../componants/CarouselComponant";
import AccueilCourseComponant from "../componants/AccueilCourseComponant";
import AccueilResultComponant from "../componants/AcceuilResultComponant";
import NavBar from "../componants/navBar";
import "../style/homeStyle.scss";
import logo from "../assets/Image1.png";
import { useEffect, useState } from "react";
import useFetch from "../service/useFetch";
import type { Race } from "../types/Race";

const RESULTATS = [
  {
    id: 1,
    course: "Course 1",
    podium: ["Alice M.", "Bob D.", "Clara R."] as [string, string, string],
  },
  {
    id: 2,
    course: "Course 2",
    podium: ["Jean P.", "Marie L.", "Pierre B."] as [string, string, string],
  },
  {
    id: 3,
    course: "Course 3",
    podium: ["Sophie K.", "Lucas T.", "Emma V."] as [string, string, string],
  },
  {
    id: 4,
    course: "Course 4",
    podium: ["Nathan G.", "Léa F.", "Hugo C."] as [string, string, string],
  },
  {
    id: 5,
    course: "Course 5",
    podium: ["Camille D.", "Théo M.", "Inès R."] as [string, string, string],
  },
  {
    id: 6,
    course: "Course 6",
    podium: ["Romain S.", "Julie A.", "Marc P."] as [string, string, string],
  },
];

export default function Accueil() {
  const [courses, setCourses] = useState<Race[]>([]);
  const { GET } = useFetch();

  useEffect(() => {
    GET<Race[]>("/api/Race").then((data) => {
      if (data) setCourses(data);
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

          <section className="home-section">
            <h2 className="section-heading">Derniers résultats :</h2>
            <Carousel
              items={RESULTATS}
              renderItem={(r) => (
                <AccueilResultComponant
                  key={r.id}
                  course={r.course}
                  podium={r.podium}
                />
              )}
            />
          </section>

          <a href="#top" className="return-top">
            ↑ Return to top
          </a>
        </div>
      </main>

      <footer className="home-footer">
        <div className="footer-brand">
          <img src={logo} alt="RacePortal" className="footer-logo-img" />
          <span className="footer-logo-text">RacePortal</span>
        </div>
        <span className="footer-copyright">
          © {new Date().getFullYear()} RacePortal — Tous droits réservés
        </span>
      </footer>
    </div>
  );
}
