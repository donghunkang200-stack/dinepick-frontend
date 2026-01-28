import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>로딩중...</div>;

  if (user?.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
