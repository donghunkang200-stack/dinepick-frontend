import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthRedirect({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ padding: 16 }}>로딩중...</div>;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}
