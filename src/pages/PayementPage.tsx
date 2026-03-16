import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import NavBar from "../componants/navBar";
import "../style/homeStyle.scss";
import "../style/payementStyle.scss";
import logo from "../assets/Image1.png";
import type { Race } from "../types/Race";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ─── Formulaire de carte ──────────────────────────────────────────────────────
function Form({ race }: { race: Race }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paiement/confirmation`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Erreur de paiement.");
      setLoading(false);
    }
  };

  return (
    <form className="paiement-form" onSubmit={handlePay}>
      <div className="paiement-recap">
        <h3>Récapitulatif</h3>
        <p className="recap-race">{race.raceName}</p>
        <p className="recap-detail">
          📅 {race.date} — 📍 {race.location}
        </p>
        <p className="recap-price">
          Montant : <strong>{race.price} $CA</strong>
        </p>
      </div>

      <div className="paiement-card-section">
        <h3>Informations de paiement</h3>
        <PaymentElement />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="form-btn" disabled={!stripe || loading}>
        {loading ? "Traitement..." : `Payer ${race.price} $CA`}
      </button>
    </form>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function PaiementPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const race = location.state?.race as Race | undefined;
  const clientSecret = location.state?.clientSecret as string | undefined;

  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!race || !clientSecret) {
      navigate("/");
    }
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
          <h2 className="paiement-title">Paiement</h2>

          {error && <p className="form-error">{error}</p>}

          {clientSecret && race ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "night",
                  variables: {
                    colorPrimary: "#e63946",
                  },
                },
              }}
            >
              <Form race={race} />
            </Elements>
          ) : (
            !error && <p className="paiement-loading">Chargement...</p>
          )}
        </div>
      </div>

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
