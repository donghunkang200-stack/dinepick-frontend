import axios from "axios";

// 공통 Axios 인스턴스 (백엔드 서버 기준)
export const http = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// 모든 요청에 accessToken 자동 첨부
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response 인터셉터 중복 등록 방지용 id
let authInterceptorId = null;

// accessToken 재발급 요청을 1번만 실행하기 위한 Promise
let refreshPromise = null;

// refreshToken으로 accessToken 재발급
async function reissueAccessToken() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return Promise.reject();

  refreshPromise = axios
    .post("http://localhost:8080/api/auth/reissue", { refreshToken })
    .then((res) => {
      const newAccessToken = res.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

/**
 * 401 발생 시 accessToken 재발급 후
 * 실패했던 요청을 다시 실행하는 인터셉터 등록
 */
export function attachAuthInterceptors(onUnauthorized) {
  if (authInterceptorId !== null) {
    http.interceptors.response.eject(authInterceptorId);
  }

  authInterceptorId = http.interceptors.response.use(
    (res) => res,
    async (err) => {
      const status = err?.response?.status;
      const original = err?.config;
      if (!original) return Promise.reject(err);

      const url = original.url || "";
      const isAuthEndpoint =
        url.includes("/api/auth/login") ||
        url.includes("/api/auth/signup") ||
        url.includes("/api/auth/reissue") ||
        url.includes("/api/auth/logout");

      if (status === 401 && !isAuthEndpoint && !original._retry) {
        original._retry = true;

        try {
          const newAccessToken = await reissueAccessToken();
          original.headers.Authorization = `Bearer ${newAccessToken}`;
          return http(original);
        } catch {
          onUnauthorized?.();
        }
      }

      return Promise.reject(err);
    }
  );
}
