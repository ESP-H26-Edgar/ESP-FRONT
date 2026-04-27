import { useEffect, useState } from "react";
import useFetch from "../service/useFetch";
import type { Race } from "../types/Race";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  race: Race | null;
}

export default function UpdateRace({ open, onClose, onUpdated, race }: Props) {
  const { POST } = useFetch();

  const [form, setForm] = useState({
    raceName: "",
    idRaceType: 0,
    kilometer: 0,
    location: "",
    date: "",
    description: "",
    numberPlace: 0,
    price: 0,
  });

  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (race) {
      setForm({
        raceName: race.raceName,
        idRaceType: race.idRaceType,
        kilometer: race.kilometer,
        location: race.location,
        date: race.date,
        description: race.description,
        numberPlace: race.numberPlace,
        price: race.price,
      });
    }
  }, [race]);

  const isOpen = open && race;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    console.log("SUBMIT CLICKED");
    const formData = new FormData();
    formData.append("IdRace", String(race!.idRace));
    formData.append("RaceName", form.raceName);
    formData.append("IdRaceType", String(form.idRaceType));
    formData.append("Kilometer", String(form.kilometer));
    formData.append("Location", form.location);
    formData.append("Date", form.date);
    formData.append("Description", form.description);
    formData.append("NumberPlace", String(form.numberPlace));
    formData.append("Price", String(form.price));
    if (image) formData.append("Image", image);
    console.log([...formData.entries()]);
    await POST(`/api/Race/Update`, formData);
    onUpdated();
    onClose();
    console.log("AFTER POST");
  };
  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer__header">
          <h2 className="drawer__title">Modifier la course</h2>
          <button className="drawer__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer__body">
          <div className="drawer__field">
            <label>Nom</label>
            <input
              name="raceName"
              value={form.raceName}
              onChange={handleChange}
            />
          </div>

          <div className="drawer__row">
            <div className="drawer__field">
              <label>Kilomètres</label>
              <input
                name="kilometer"
                type="number"
                value={form.kilometer}
                onChange={handleChange}
              />
            </div>

            <div className="drawer__field">
              <label>Lieu</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="drawer__field">
            <label>Date</label>
            <input
              name="date"
              type="datetime-local"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="drawer__row">
            <div className="drawer__field">
              <label>Places</label>
              <input
                name="numberPlace"
                type="number"
                value={form.numberPlace}
                onChange={handleChange}
              />
            </div>

            <div className="drawer__field">
              <label>Prix</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="drawer__field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="drawer__field">
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        <div className="drawer__footer">
          <button className="drawer__btn-cancel" onClick={onClose}>
            Annuler
          </button>
          <button className="drawer__btn-submit" onClick={handleSubmit}>
            Enregistrer
          </button>
        </div>
      </aside>
    </>
  );
}
