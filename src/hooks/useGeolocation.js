import { useEffect, useState } from "react";

// 브라우저 위치 권한/좌표를 가져오는 커스텀 훅
// - loaded: 위치 조회가 끝났는지 여부(성공/실패 포함)
// - coords: { lat, lng } (성공 시)
// - error: Error/GeolocationPositionError (실패 시)
export function useGeolocation(options = {}) {
  // 위치 조회 상태를 한 객체로 관리
  const [state, setState] = useState({
    loaded: false,
    coords: null,
    error: null,
  });

  // 마운트 시 1회만 현재 위치 요청
  useEffect(() => {
    // geolocation API 지원 여부 체크
    if (!("geolocation" in navigator)) {
      setState({
        loaded: true,
        coords: null,
        error: new Error("Geolocation not supported"),
      });
      return;
    }

    // 현재 위치 1회 조회(getCurrentPosition)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // 성공: 위도/경도만 뽑아서 저장
        setState({
          loaded: true,
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          error: null,
        });
      },
      (err) => {
        // 실패: 권한 거부/타임아웃 등 에러 저장
        console.log("GEO ERROR", err.code, err.message);
        setState({
          loaded: true,
          coords: null,
          error: err,
        });
      },
      {
        // 기본 옵션(필요하면 호출하는 쪽에서 options로 덮어쓰기)
        enableHighAccuracy: false, // 배터리/속도 우선(초기 타임아웃 완화)
        timeout: 15000, // 15초 안에 못 받으면 실패 처리
        maximumAge: 60000, // 1분 이내 캐시 좌표 허용
        ...options,
      }
    );
  }, []); // 최초 1회 실행

  return state;
}
