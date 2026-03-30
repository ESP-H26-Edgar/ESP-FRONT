export type Registration = {
  idRegistration: number;
  idRace: number;
  bibNumber: number;
  nom: string | null;
  prenom: string | null;
  adresseMail: string | null;
  dateNaissance: string | null;
  sexe: "H" | "F" | null;
  phone: string | null;
};
