import { Navigate } from "react-router-dom";
import { getUserFromToken } from "../src/service/jwtDecode";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role =
    user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
