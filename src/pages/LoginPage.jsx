import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import "./AuthPage.css"; // 로그인/회원가입 공용 스타일

/*
  로그인 페이지
  - 이메일/비밀번호로 로그인
  - 로그인 후 이전 페이지로 복귀
*/
const LoginPage = () => {
  // 입력 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 이전 위치 (없으면 홈)
  const from = location.state?.from;
  const redirectTo = from?.pathname
    ? `${from.pathname}${from.search || ""}${from.hash || ""}`
    : "/";

  // 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const me = await login({ email, password });

      toast.success("로그인 성공.");

      // 관리자면 관리자 페이지 우선 이동
      if (me?.role === "ROLE_ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">로그인</h2>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">이메일</label>
            <input
              className="auth-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">비밀번호</label>
            <input
              className="auth-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button className="auth-btn" type="submit" disabled={submitting}>
            {submitting ? "로그인 중..." : "로그인하기"}
          </button>
        </form>

        {/* 회원가입 이동 */}
        <p className="auth-foot">
          계정이 없으신가요?{" "}
          <Link className="auth-link" to="/signup">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
