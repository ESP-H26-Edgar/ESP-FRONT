import NavBar from "../componants/navBar";
import "../style/Home.scss";
import CourseList from "../componants/Courselist";
import Footer from "../componants/footer";

export default function ListeInscrit() {
  return (
    <>
      <div className="home-wrapper">
        <NavBar />
        <header className="home-hero">
          <h1 className="hero-title">
            Race<span>Portal</span>
          </h1>
        </header>
        <div className="home-main">
          <div className="home-content">
            <CourseList perPage={3} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
