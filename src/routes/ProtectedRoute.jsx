import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  // 인증 상태 및 로딩 여부
  const { isAuthenticated, loading } = useAuth();

  // 인증 상태 확인 중이면 대기 UI
  if (loading) return <div style={{ padding: 16 }}>로딩중...</div>;

  // 비인증 상태면 로그인 페이지로 리다이렉트
  // 인증상태면 보호된 페이지 렌더링
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
