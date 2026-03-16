import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useFetch from "../service/useFetch";

export default function VerifyLogin() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const { GET } = useFetch();

  useEffect(() => {
    GET("/api/Login/me")
      .then(() => setAuth(true))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return null;

  return auth ? <Outlet /> : <Navigate to="/login" replace />;
}
