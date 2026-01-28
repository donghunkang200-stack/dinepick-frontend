let kakaoPromise = null;

// 카카오맵 SDK를 한 번만 로드하기 위한 로더
export function loadKakaoMaps() {
  // 이미 로드되어 있으면 바로 사용
  if (window.kakao?.maps) return Promise.resolve(window.kakao);

  // 로딩 중이면 같은 Promise 재사용
  if (kakaoPromise) return kakaoPromise;

  // 환경변수에서 카카오맵 키 가져오기
  const key = import.meta.env.VITE_KAKAO_MAP_KEY;
  if (!key) return Promise.reject(new Error("VITE_KAKAO_MAP_KEY가 없습니다."));

  kakaoPromise = new Promise((resolve, reject) => {
    // 이미 script 태그가 있으면 중복 생성 방지
    const existing = document.querySelector('script[data-kakao-maps="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.kakao));
      existing.addEventListener("error", reject);
      return;
    }

    // 카카오맵 SDK 스크립트 동적 삽입
    const script = document.createElement("script");
    script.dataset.kakaoMaps = "1";
    script.async = true;

    // Geocoder 사용을 위한 라이브러리 services 포함
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`;

    // SDK 로드 완료 후 maps.load 호출
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));

    script.onerror = () => reject(new Error("카카오맵 SDK 로드 실패"));

    document.head.appendChild(script);
  });

  return kakaoPromise;
}
