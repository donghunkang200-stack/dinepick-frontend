import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { login as loginApi, signup as signupApi, logoutApi } from "../api/auth";
import { fetchMe } from "../api/members";
import { attachAuthInterceptors } from "../api/api";
import { getJwtExpMs } from "../utils/jwt";
import { toast } from "react-toastify";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 유저 정보 / 초기 로딩 상태
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 토큰 존재 기반 인증 상태
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  // 수동 로그아웃 중이면 만료처리(expired) 흐름을 막기 위한 플래그
  const manualLogoutRef = useRef(false);

  // accessToken 만료 직전 재발급용 타이머
  const timerRef = useRef(null);

  // 재발급 타이머 정리
  const clearTimer = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  // accessToken 만료 30초 전에 reissue 예약
  const scheduleAutoReissue = (accessToken) => {
    clearTimer();

    const expMs = getJwtExpMs(accessToken);
    if (!expMs) return;

    const delay = expMs - 30_000 - Date.now();
    if (delay <= 0) return;

    timerRef.current = setTimeout(async () => {
      try {
        if (manualLogoutRef.current) return;

        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return;

        const baseURL = "http://localhost:8080";
        const res = await axios.post(
          `${baseURL}/api/auth/reissue`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = res.data?.accessToken;
        if (!newAccessToken) throw new Error("No accessToken");

        localStorage.setItem("accessToken", newAccessToken);
        scheduleAutoReissue(newAccessToken);
      } catch {
        await logout("expired");
      }
    }, delay);
  };

  // 프론트 로그아웃 정리(토큰/상태/타이머)
  const clearClientAuth = () => {
    clearTimer();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  // 로그아웃
  // - manual: 버튼 로그아웃(페이지 이동은 호출한 곳에서)
  // - expired: 만료 처리(토스트 + 로그인으로 이동)
  const logout = async (reason = "manual") => {
    if (reason === "manual") manualLogoutRef.current = true;

    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) await logoutApi(refreshToken);
    } catch {
      // 서버 로그아웃 실패해도 프론트는 무조건 정리
    } finally {
      clearClientAuth();

      if (reason === "expired" && !manualLogoutRef.current) {
        toast.info("세션이 만료되었습니다. 다시 로그인해주세요.", {
          position: "top-center",
          autoClose: 3000,
        });
        window.location.hash = "#/login"; // HashRouter 기준
      }

      if (reason === "manual") manualLogoutRef.current = false;
    }
  };

  // 토큰 있으면 내 정보 로드 + 재발급 예약
  const loadMe = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const me = await fetchMe();
      setUser(me);
      setIsAuthenticated(true);
      scheduleAutoReissue(token);
    } catch {
      if (manualLogoutRef.current) {
        setLoading(false);
        return;
      }
      await logout("expired");
    } finally {
      setLoading(false);
    }
  };

  // 앱 시작 시: 인터셉터 설치 + 로그인 상태 복원
  useEffect(() => {
    attachAuthInterceptors(() => logout("expired"));
    loadMe();

    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 회원가입
  const signup = async (payload) => {
    await signupApi(payload);
  };

  // 로그인: 토큰 저장 -> 재발급 예약 -> 내정보 로드
  const login = async (payload) => {
    const { accessToken, refreshToken } = await loginApi(payload);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setIsAuthenticated(true);
    scheduleAutoReissue(accessToken);
    await loadMe();
  };

  // Provider 값 메모(불필요한 리렌더 방지)
  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      signup,
      login,
      logout,
      reloadMe: loadMe,
    }),
    [user, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// AuthContext 사용 훅(Provider 밖이면 에러)
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
