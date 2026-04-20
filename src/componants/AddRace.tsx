import { useEffect, useState } from "react";
import "../style/AddRace.scss";
import useFetch from "../service/useFetch";
import type { RaceType } from "../types/RaceType";

interface AddRaceProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface RaceForm {
  raceName: string;
  idRaceType: number | "";
  date: string;
  location: string;
  numberPlace: number | "";
  price: number | "";
  description: string;
  distance: number | "";
  image: File | null;
}

const EMPTY: RaceForm = {
  raceName: "",
  idRaceType: "",
  date: "",
  location: "",
  numberPlace: "",
  price: "",
  description: "",
  distance: "",
  image: null,
};

export default function AddRace({ open, onClose, onCreated }: AddRaceProps) {
  const [form, setForm] = useState<RaceForm>(EMPTY);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { POST, GET } = useFetch();
  const [raceTypes, setRaceTypes] = useState<RaceType[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file }));
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async () => {
    if (
      !form.raceName ||
      !form.idRaceType ||
      !form.date ||
      !form.location ||
      !form.numberPlace ||
      !form.price ||
      !form.distance ||
      !form.image ||
      !form.description
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (form.numberPlace <= 0 || form.price <= 0 || form.distance <= 0) {
      setError("Vous avez enregistré des valeur inférieures à 0.");
      return;
    }
    if (new Date(form.date) < new Date()) {
      setError("La date n'est pas valide");
      return;
    }
    setError(null);
    setLoading(true);

    const body = new FormData();
    body.append("raceName", form.raceName);
    body.append("idRaceType", String(form.idRaceType));
    body.append("date", form.date);
    body.append("location", form.location);
    body.append("numberPlace", String(form.numberPlace));
    body.append("price", String(form.price));
    body.append("description", form.description);
    body.append("kilometer", String(form.distance));
    if (form.image) body.append("image", form.image);

    await POST("/api/Race/Create", body);
    setLoading(false);
    setForm(EMPTY);
    setPreview(null);
    onCreated();
    onClose();
  };

  const handleClose = () => {
    setForm(EMPTY);
    setPreview(null);
    setError(null);
    onClose();
  };
  useEffect(() => {
    GET<RaceType[]>("/api/RaceType").then((data) => {
      if (data) setRaceTypes(data);
    });
  }, []);
  return (
    <>
      <div
        className={`drawer-overlay ${open ? "open" : ""}`}
        onClick={handleClose}
      />
      <aside className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer__header">
          <h2 className="drawer__title">Nouvelle course</h2>
          <button className="drawer__close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="drawer__body">
          <div className="drawer__field">
            <label>Nom de la course </label>
            <input
              name="raceName"
              value={form.raceName}
              onChange={handleChange}
              placeholder="Ex : Marathon de Montréal"
            />
          </div>
          <div className="drawer__field">
            <label>Type de course </label>
            <select
              name="idRaceType"
              value={form.idRaceType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  idRaceType: Number(e.target.value),
                }))
              }
            >
              <option value="">— Sélectionner un type —</option>
              {raceTypes.map((t) => (
                <option key={t.idRaceType} value={t.idRaceType}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div className="drawer__row">
            <div className="drawer__field">
              <label>Date & heure *</label>
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="drawer__field">
              <label>Distance (km) </label>
              <input
                type="number"
                name="distance"
                value={form.distance}
                onChange={handleChange}
                placeholder="42"
                min="0"
              />
            </div>
          </div>

          <div className="drawer__field">
            <label>Lieu</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Ex : Montréal, QC"
            />
          </div>

          <div className="drawer__row">
            <div className="drawer__field">
              <label>Nombre de places </label>
              <input
                type="number"
                name="numberPlace"
                value={form.numberPlace}
                onChange={handleChange}
                placeholder="500"
                min="1"
              />
            </div>
            <div className="drawer__field">
              <label>Prix ($ CA) </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="75"
                min="0"
              />
            </div>
          </div>

          <div className="drawer__field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Décrivez la course..."
              rows={4}
            />
          </div>

          <div className="drawer__field">
            <label>Image</label>
            <label className="drawer__upload">
              {preview ? (
                <img src={preview} alt="preview" className="drawer__preview" />
              ) : (
                <span className="drawer__upload-placeholder">
                  Cliquer pour choisir une image
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />
            </label>
          </div>
        </div>
        {error && <p className="drawer__error">{error}</p>}
        <div className="drawer__footer">
          <button className="drawer__btn-cancel" onClick={handleClose}>
            Annuler
          </button>
          <button
            className="drawer__btn-submit"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Créer la course"}
          </button>
        </div>
      </aside>
    </>
  );
}
