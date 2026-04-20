import NavBar from "../componants/navBar";
import "../style/Home.scss";
import type { Race } from "../types/Race";
import type { Registration } from "../types/Registration";
import { useState, useEffect } from "react";
import useFetch from "../service/useFetch";
import { useLocation } from "react-router-dom";
import CourseListRegister from "../componants/CourselistRegister";
import Footer from "../componants/footer";

export default function Inscription() {
  const [courses, setCourses] = useState<Race[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const { GET } = useFetch();
  const location = useLocation();

  useEffect(() => {
    GET<Race[]>("/api/Race").then((data) => {
      if (data) setCourses(data);
    });
    GET<Registration[]>("/api/InscriptionCourse").then((data) => {
      if (data) setRegistrations(data);
    });
  }, []);

  const registeredCounts = registrations.reduce<Record<number, number>>(
    (acc, r) => {
      acc[r.idRace] = (acc[r.idRace] ?? 0) + 1;
      return acc;
    },
    {},
  );

  useEffect(() => {
    if (location.hash && courses.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash, courses]);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="home-wrapper">
      <NavBar />
      <header className="home-hero">
        <h1 className="hero-title">
          Race<span>Portal</span>
        </h1>
      </header>
      <div className="home-main">
        <div className="home-content">
          <CourseListRegister
            courses={courses}
            perPage={3}
            registeredCounts={registeredCounts}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
