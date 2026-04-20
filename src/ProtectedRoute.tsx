import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthService } from "../src/service/authService";
import type { CurrentUser } from "../src/service/authService";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { getMe } = useAuthService();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => {
        if (data) setUser(data);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
