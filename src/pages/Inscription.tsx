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
  const [search, setSearch] = useState("");
  const [kmFilter, setKmFilter] = useState<string>("tous");
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

  const filteredCourses = courses.filter((course) => {
    const query = search.trim().toLowerCase();
    const matchSearch =
      !query ||
      course.raceName?.toLowerCase().includes(query) ||
      course.location?.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query);

    const matchKm =
      kmFilter === "tous" ||
      (kmFilter === "0-10" && course.kilometer <= 10) ||
      (kmFilter === "10-21" &&
        course.kilometer > 10 &&
        course.kilometer <= 21) ||
      (kmFilter === "21-42" &&
        course.kilometer > 21 &&
        course.kilometer <= 42) ||
      (kmFilter === "42+" && course.kilometer > 42);

    return matchSearch && matchKm;
  });

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

  const hasActiveFilters = search || kmFilter !== "tous";

  const resetFilters = () => {
    setSearch("");
    setKmFilter("tous");
  };

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
          <div className="inscription-filters">
            <div className="inscription-search">
              <input
                type="text"
                placeholder="Rechercher par nom, lieu, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="inscription-search-input"
              />
              {search && (
                <button
                  className="inscription-search-clear"
                  onClick={() => setSearch("")}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="inscription-filter-row">
              <div className="inscription-filter-group">
                <label>Distance</label>
                <div className="inscription-filter-btns">
                  {[
                    { value: "tous", label: "Tous" },
                    { value: "0-10", label: "≤ 10 km" },
                    { value: "10-21", label: "10–21 km" },
                    { value: "21-42", label: "21–42 km" },
                    { value: "42+", label: "42+ km" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      className={`inscription-filter-btn ${kmFilter === opt.value ? "active" : ""}`}
                      onClick={() => setKmFilter(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  className="inscription-filter-reset"
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>

          <CourseListRegister
            courses={filteredCourses}
            perPage={3}
            registeredCounts={registeredCounts}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
