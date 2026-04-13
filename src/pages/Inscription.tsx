import NavBar from "../componants/navBar";
import "../style/Home.scss";
import type { Race } from "../types/Race";
import { useState, useEffect } from "react";
import useFetch from "../service/useFetch";
import { useLocation } from "react-router-dom";
import CourseListRegister from "../componants/CourselistRegister";
import Footer from "../componants/footer";

export default function Inscription() {
  const [courses, setCourses] = useState<Race[]>([]);
  const { GET } = useFetch();
  const location = useLocation();

  useEffect(() => {
    GET<Race[]>("/api/Race").then((data) => {
      if (data) setCourses(data);
    });
  }, []);

  //permet de "scroller" automatiquement au niveau de la course cliquée à l'acceuil
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
          <CourseListRegister courses={courses} perPage={3} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
