import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthRedirect({ children }) {
  // 인증 상태 및 로딩 상태
  const { isAuthenticated, loading } = useAuth();

  // 현재 위치 정보 (이전 페이지 복귀용)
  const location = useLocation();

  // 인증 상태 확인 중이면 대기 UI
  if (loading) return <div style={{ padding: 16 }}>로딩중...</div>;

  // 로그인 페이지로 이동할 때 저장된 이전 위치
  const from = location.state?.from;

  // 복귀 경로 생성 (없으면 홈으로)
  const redirectTo = from?.pathname
    ? `${from.pathname}${from.search || ""}${from.hash || ""}`
    : "/";

  // 이미 로그인 상태면 원래 페이지로 리다이렉트
  // 로그인 안 됐으면 자식 컴포넌트(로그인/회원가입 페이지) 렌더
  return isAuthenticated ? <Navigate to={redirectTo} replace /> : children;
}
