// JWT payload 디코딩 (Base64 → JSON)
export function decodeJwtPayload(token) {
  try {
    // JWT 구조: header.payload.signature
    const base64Url = token.split(".")[1];

    // Base64URL → Base64 변환
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // 디코딩 후 JSON 파싱
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(json);
  } catch {
    // 형식이 잘못된 토큰이거나 디코딩 실패 시
    return null;
  }
}

// JWT 만료 시간(exp)을 ms 단위 timestamp로 변환
export function getJwtExpMs(token) {
  const payload = decodeJwtPayload(token);

  // exp 없으면 유효하지 않은 토큰
  if (!payload?.exp) return null;

  // JWT exp는 초 단위 → ms 단위로 변환
  return payload.exp * 1000;
}
