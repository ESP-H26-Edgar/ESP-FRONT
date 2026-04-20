import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  exp: number;
}

export const getUserFromToken = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  return jwtDecode<JwtPayload>(token);
};
