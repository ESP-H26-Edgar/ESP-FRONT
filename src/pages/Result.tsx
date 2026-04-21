import NavBar from "../componants/navBar";
import "../style/Home.scss";
import ResultList from "../componants/ResultListe";
import Footer from "../componants/footer";

export default function Result() {
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
            <ResultList perPage={5} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
