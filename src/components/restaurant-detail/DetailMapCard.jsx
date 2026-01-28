import { useEffect, useRef, useState } from "react";
import { loadKakaoMaps } from "../../utils/kakaoLoader";
import "./DetailMapCard.css";

// 레스토랑 주소를 지오코딩해서 지도 중심/마커를 찍는 상세 위치 카드
const DetailMapCard = ({ restaurant }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // 내 위치(펄스) 오버레이 관리
  const myLocOverlayRef = useRef(null);
  const injectedPulseCssRef = useRef(false);

  const [hint, setHint] = useState("");

  if (!restaurant) return null;

  const { name = "", address = "" } = restaurant;

  // 내 위치 펄스 CSS를 1회만 주입(다른 컴포넌트에서 이미 넣었을 수도 있음)
  const ensurePulseCss = () => {
    if (injectedPulseCssRef.current) return;
    injectedPulseCssRef.current = true;

    if (document.querySelector('style[data-my-location-pulse="1"]')) return;

    const style = document.createElement("style");
    style.setAttribute("data-my-location-pulse", "1");
    style.textContent = `
      .my-loc {
        position: relative;
        width: 12px;
        height: 12px;
        border-radius: 999px;
        background: #1a73e8;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.95);
      }
      .my-loc::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 12px;
        height: 12px;
        transform: translate(-50%, -50%);
        border-radius: 999px;
        background: rgba(26,115,232,0.35);
        animation: myloc-pulse 1.6s ease-out infinite;
      }
      @keyframes myloc-pulse {
        0%   { transform: translate(-50%, -50%) scale(1); opacity: 0.85; }
        70%  { transform: translate(-50%, -50%) scale(3.6); opacity: 0.00; }
        100% { transform: translate(-50%, -50%) scale(3.6); opacity: 0.00; }
      }
    `;
    document.head.appendChild(style);
  };

  // 내 위치 오버레이 제거(언마운트/재초기화 대비)
  const clearMyLoc = () => {
    if (!myLocOverlayRef.current) return;
    myLocOverlayRef.current.setMap(null);
    myLocOverlayRef.current = null;
  };

  // 내 위치 도트 오버레이를 생성하거나, 있으면 위치만 갱신
  const showMyLocPulse = (kakao, map, lat, lng) => {
    if (!kakao || !map) return;

    ensurePulseCss();

    const ll = new kakao.maps.LatLng(lat, lng);

    if (myLocOverlayRef.current) {
      myLocOverlayRef.current.setPosition(ll);
      myLocOverlayRef.current.setMap(map);
      return;
    }

    const el = document.createElement("div");
    el.className = "kakao-overlay my-loc-wrap";

    const dot = document.createElement("div");
    dot.className = "my-loc";
    el.appendChild(dot);

    // 오버레이 클릭이 지도 이벤트로 전파되지 않도록 차단
    ["click", "mousedown", "mouseup", "touchstart", "touchend"].forEach((evt) =>
      el.addEventListener(evt, (e) => e.stopPropagation())
    );

    myLocOverlayRef.current = new kakao.maps.CustomOverlay({
      position: ll,
      content: el,
      xAnchor: 0.5,
      yAnchor: 0.5,
      zIndex: 10,
    });

    myLocOverlayRef.current.setMap(map);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      setHint("");

      try {
        const kakao = await loadKakaoMaps();
        if (!mounted || !mapContainerRef.current) return;

        // 지도 생성(초기 중심은 fallback)
        const fallback = new kakao.maps.LatLng(37.5665, 126.978);
        const map = new kakao.maps.Map(mapContainerRef.current, {
          center: fallback,
          level: 3,
        });
        mapRef.current = map;

        // 마커 생성/갱신(초기 위치는 fallback)
        const marker =
          markerRef.current || new kakao.maps.Marker({ position: fallback });
        marker.setMap(map);
        marker.setPosition(fallback);
        markerRef.current = marker;

        // 브라우저 위치 권한이 있으면 내 위치 펄스 표시
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              if (!mounted) return;
              showMyLocPulse(
                kakao,
                map,
                pos.coords.latitude,
                pos.coords.longitude
              );
            },
            () => {},
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
          );
        }

        // 주소가 없으면 지오코딩 생략
        if (!address?.trim()) {
          setHint("주소 정보가 없어 기본 위치로 표시됩니다.");
          return;
        }

        // 주소 -> 좌표 변환 후 지도/마커 이동
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(address, (result, status) => {
          if (!mounted) return;

          if (status !== kakao.maps.services.Status.OK || !result?.length) {
            setHint("주소를 찾을 수 없습니다. 기본 위치로 표시됩니다.");
            return;
          }

          const { x, y } = result[0];
          const pos = new kakao.maps.LatLng(Number(y), Number(x));

          map.setCenter(pos);
          marker.setPosition(pos);

          // 마커 인포윈도우(선택)
          if (name) {
            const iw = new kakao.maps.InfoWindow({
              content: `<div style="padding:6px 8px;font-size:12px;">${name}</div>`,
            });
            iw.open(map, marker);
          }
        });

        // 컨테이너 레이아웃 반영 타이밍 보정
        setTimeout(() => {
          if (!mounted) return;
          map.relayout();
          map.setCenter(map.getCenter());
        }, 0);
      } catch (e) {
        setHint(e?.message || "지도 초기화 실패");
      }
    };

    init();

    return () => {
      mounted = false;

      if (markerRef.current) markerRef.current.setMap(null);
      markerRef.current = null;
      mapRef.current = null;

      clearMyLoc();
    };
  }, [address, name]);

  return (
    <article className="detail-card">
      <header className="detail-card-header">
        <h2 className="detail-card-title">위치</h2>
      </header>

      <div className="detail-map-hero">
        <div ref={mapContainerRef} className="detail-map-hero-bg" />

        <div className="detail-map-hero-overlay">
          <div className="detail-map-text">
            <div className="detail-map-name">{name || " "}</div>
            <div className="detail-map-address">{address || " "}</div>
          </div>
        </div>
      </div>

      <div className="detail-map-hint">{hint}</div>
    </article>
  );
};

export default DetailMapCard;
