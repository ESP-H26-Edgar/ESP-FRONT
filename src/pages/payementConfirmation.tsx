import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import NavBar from "../componants/navBar";
import "../style/Home.scss";
import Footer from "../componants/footer";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PayementConfirmation() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading",
  );

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) {
      setStatus("error");
      return;
    }

    stripePromise.then((stripe) => {
      if (!stripe) return;
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent?.status === "succeeded") setStatus("success");
        else setStatus("error");
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

      <div className="home-main">
        <div className="home-content">
          {status === "loading" && (
            <p className="paiement-loading">Vérification du paiement...</p>
          )}

          {status === "success" && (
            <div className="form-success">
              <h3>✅ Paiement confirmé !</h3>
              <p>
                Votre inscription est validée. Vous recevrez une confirmation
                par email.
              </p>
              <button className="form-btn" onClick={() => navigate("/Accueil")}>
                Retour à l'accueil
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="form-success">
              <h3>❌ Paiement échoué</h3>
              <p>Une erreur est survenue. Veuillez réessayer.</p>
              <button
                className="form-btn"
                onClick={() => navigate("/inscription")}
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
