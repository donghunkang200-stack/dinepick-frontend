import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import "./AuthPage.css";

const SignupPage = () => {
  // 입력값 상태
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 필드별 에러 상태 (백엔드 validation 메시지)
  const [fieldErrors, setFieldErrors] = useState({}); // { name: "", email: "", password: "" }

  // 제출 중 상태 (중복 요청 방지)
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup } = useAuth();

  // === 백엔드 에러 응답을 최대한 robust하게 파싱 ===
  const parseErrorResponse = (err) => {
    const data = err?.response?.data;

    // 1) 추천 형태: { message, errors: {field: msg} }
    if (data?.errors && typeof data.errors === "object") {
      return {
        message: data.message || "입력값을 확인해주세요.",
        errors: data.errors,
      };
    }

    // 2) 흔한 형태: { fieldErrors: {field: msg} } 같은 커스텀
    if (data?.fieldErrors && typeof data.fieldErrors === "object") {
      return {
        message: data.message || "입력값을 확인해주세요.",
        errors: data.fieldErrors,
      };
    }

    // 3) Spring 기본 에러 중 일부 형태 (배열)
    // 예: { errors: [{ field: "email", defaultMessage: "..." }, ...] }
    if (Array.isArray(data?.errors)) {
      const mapped = {};
      for (const e of data.errors) {
        const field = e?.field;
        const msg = e?.defaultMessage || e?.message;
        if (field && msg) mapped[field] = msg;
      }
      if (Object.keys(mapped).length > 0) {
        return {
          message: data.message || "입력값을 확인해주세요.",
          errors: mapped,
        };
      }
    }

    // 4) 단일 메시지: { message: "..." }
    if (typeof data?.message === "string" && data.message.trim()) {
      return { message: data.message, errors: {} };
    }

    // 5) 그 외: axios 에러 메시지 fallback
    return {
      message: "회원가입에 실패했습니다. 다시 시도해주세요.",
      errors: {},
    };
  };

  const firstErrorText = useMemo(() => {
    const keys = ["name", "email", "password"];
    for (const k of keys) {
      if (fieldErrors?.[k]) return fieldErrors[k];
    }
    // 혹시 다른 키로 내려오는 경우까지
    const any = Object.values(fieldErrors || {}).find(Boolean);
    return any || "";
  }, [fieldErrors]);

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setFieldErrors({}); // 이전 에러 초기화

    try {
      await signup({ name, email, password });

      toast.success("가입이 완료되었습니다.");
      navigate("/login");
    } catch (err) {
      const { message, errors } = parseErrorResponse(err);

      // 필드 에러가 있으면 필드에 표시
      if (errors && Object.keys(errors).length > 0) {
        setFieldErrors(errors);

        // toast에는 대표 에러 1개만 (너무 도배 방지)
        toast.error(firstErrorText || message);
      } else {
        // 필드 에러 없으면 메시지만
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 입력 변경 시 해당 필드 에러 제거(UX)
  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev?.[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2 className="auth-title">회원가입</h2>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label className="auth-label">이름</label>
            <input
              className={`auth-input ${fieldErrors.name ? "is-error" : ""}`}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearFieldError("name");
              }}
              placeholder="이름을 입력하세요"
              autoComplete="name"
            />
            {fieldErrors.name && (
              <p className="auth-error">{fieldErrors.name}</p>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label">이메일</label>
            <input
              className={`auth-input ${fieldErrors.email ? "is-error" : ""}`}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              placeholder="example@mail.com"
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="auth-error">{fieldErrors.email}</p>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label">비밀번호</label>
            <input
              className={`auth-input ${fieldErrors.password ? "is-error" : ""}`}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {fieldErrors.password && (
              <p className="auth-error">{fieldErrors.password}</p>
            )}
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "처리 중..." : "가입하기"}
          </button>
        </form>

        <p className="auth-foot">
          이미 계정이 있으신가요?{" "}
          <Link className="auth-link" to="/login">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
