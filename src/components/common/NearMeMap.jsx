import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadKakaoMaps } from "../../utils/kakaoLoader";
import { useGeolocation } from "../../hooks/useGeolocation";
import { fetchNearbyRestaurants } from "../../api/restaurants";
import "./nearMeMap.css";

// 기본 위치(권한 거부/미지원 시)
const DEFAULT_POS = { lat: 35.1502336, lng: 129.0600448 };

// 반경 값 보정
function clampRadiusKm(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return 10;
  return Math.min(Math.max(n, 0.1), 30);
}

// 주소 변환 동시 요청 제한
async function mapWithConcurrency(items, mapper, concurrency = 5) {
  const results = new Array(items.length);
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const cur = idx++;
      results[cur] = await mapper(items[cur], cur);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    worker,
  );
  await Promise.all(workers);
  return results;
}

export default function NearMeMap({
  radiusKm = 10,
  keyword = "",
  category = "ALL",
  page = 0,
  size = 30,
  height = 420,
  useFallbackWhenDenied = true,
}) {
  const navigate = useNavigate();
  const { loaded, coords, error } = useGeolocation();

  // 검색 폼 입력값
  const [q, setQ] = useState("");

  // 안전 반경
  const safeRadiusKm = useMemo(() => clampRadiusKm(radiusKm), [radiusKm]);

  // 지도 컨테이너
  const containerRef = useRef(null);

  // 카카오 지도 참조
  const kakaoRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);

  // 마커/오버레이 참조
  const markersRef = useRef([]);
  const overlayRef = useRef(null);

  // 내 위치(펄스) 오버레이
  const myLocationOverlayRef = useRef(null);
  const injectedPulseCssRef = useRef(false);

  // 주소 좌표 캐시
  const geoCacheRef = useRef(new Map());

  // 상태
  const [mapStatus, setMapStatus] = useState("idle"); // idle|loading|ready|error
  const [loadingData, setLoadingData] = useState(false);
  const [apiError, setApiError] = useState(null);

  // 기준 위치(현재 위치 or fallback)
  const basePos = useMemo(() => {
    if (coords) return coords;
    if (loaded && !coords && useFallbackWhenDenied) return DEFAULT_POS;
    return null;
  }, [coords, loaded, useFallbackWhenDenied]);

  // 내 위치 펄스 CSS 1회 주입
  const ensurePulseCss = () => {
    if (injectedPulseCssRef.current) return;
    injectedPulseCssRef.current = true;

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

  // 식당 오버레이 제거
  const clearOverlay = () => {
    if (!overlayRef.current) return;
    overlayRef.current.setMap(null);
    overlayRef.current = null;
  };

  // 식당 마커/오버레이 초기화
  const clearRestaurantMarkers = () => {
    clearOverlay();
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  };

  // 내 위치 펄스 표시/갱신
  const setMyLocationPulse = (pos) => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;
    if (!kakao || !map) return;

    ensurePulseCss();

    const ll = new kakao.maps.LatLng(pos.lat, pos.lng);

    if (myLocationOverlayRef.current) {
      myLocationOverlayRef.current.setPosition(ll);
      myLocationOverlayRef.current.setMap(map);
      return;
    }

    const el = document.createElement("div");
    el.className = "my-loc";

    // 오버레이 클릭 이벤트 전파 차단
    ["click", "mousedown", "mouseup", "touchstart", "touchend"].forEach((evt) =>
      el.addEventListener(evt, (e) => e.stopPropagation()),
    );

    myLocationOverlayRef.current = new kakao.maps.CustomOverlay({
      position: ll,
      content: el,
      xAnchor: 0.5,
      yAnchor: 0.5,
      zIndex: 10,
    });

    myLocationOverlayRef.current.setMap(map);
  };

  // 주소 -> 좌표 변환(캐시 포함)
  const geocodeAddress = (address) => {
    const kakao = kakaoRef.current;
    const geocoder = geocoderRef.current;
    if (!kakao || !geocoder) return Promise.resolve(null);

    const key = String(address || "").trim();
    if (!key) return Promise.resolve(null);

    const cached = geoCacheRef.current.get(key);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve) => {
      geocoder.addressSearch(key, (result, st) => {
        if (st !== kakao.maps.services.Status.OK || !result?.length) {
          resolve(null);
          return;
        }
        const { y, x } = result[0];
        const coord = { lat: Number(y), lng: Number(x) };
        geoCacheRef.current.set(key, coord);
        resolve(coord);
      });
    });
  };

  // 식당 마커 클릭 시 상세 오버레이 표시
  const showRestaurantOverlay = (restaurant, positionLatLng) => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;
    if (!kakao || !map) return;

    clearOverlay();

    const wrap = document.createElement("div");
    wrap.style.background = "white";
    wrap.style.border = "1px solid rgba(0,0,0,0.08)";
    wrap.style.borderRadius = "16px";
    wrap.style.boxShadow = "0 16px 40px rgba(0,0,0,0.16)";
    wrap.style.padding = "12px 12px 10px";
    wrap.style.minWidth = "260px";
    wrap.style.maxWidth = "320px";
    wrap.style.fontSize = "13px";
    wrap.style.lineHeight = "1.25";

    // 오버레이 클릭 이벤트 전파 차단
    ["click", "mousedown", "mouseup", "touchstart", "touchend"].forEach((evt) =>
      wrap.addEventListener(evt, (e) => e.stopPropagation()),
    );

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "flex-start";
    header.style.justifyContent = "space-between";
    header.style.gap = "10px";

    const left = document.createElement("div");
    left.style.flex = "1";
    left.style.minWidth = "0";

    const title = document.createElement("div");
    title.textContent = restaurant.name || "Restaurant";
    title.style.fontWeight = "900";
    title.style.fontSize = "14px";
    title.style.letterSpacing = "-0.2px";
    title.style.whiteSpace = "nowrap";
    title.style.overflow = "hidden";
    title.style.textOverflow = "ellipsis";

    const sub = document.createElement("div");
    sub.style.marginTop = "6px";
    sub.style.display = "flex";
    sub.style.flexWrap = "wrap";
    sub.style.gap = "6px";

    const makeChip = (text, variant = "neutral") => {
      const chip = document.createElement("span");
      chip.textContent = text;
      chip.style.display = "inline-flex";
      chip.style.alignItems = "center";
      chip.style.gap = "6px";
      chip.style.padding = "5px 8px";
      chip.style.borderRadius = "999px";
      chip.style.fontSize = "12px";
      chip.style.fontWeight = "700";
      chip.style.border = "1px solid rgba(0,0,0,0.08)";

      if (variant === "dark") {
        chip.style.background = "#111";
        chip.style.color = "white";
        chip.style.border = "1px solid #111";
      } else if (variant === "blue") {
        chip.style.background = "rgba(26,115,232,0.10)";
        chip.style.color = "#1a73e8";
      } else {
        chip.style.background = "rgba(0,0,0,0.04)";
        chip.style.color = "rgba(0,0,0,0.78)";
      }
      return chip;
    };

    const dist =
      restaurant.distance != null
        ? `${Number(restaurant.distance).toFixed(2)}km`
        : null;
    if (dist) sub.appendChild(makeChip(dist, "blue"));
    if (restaurant.category) sub.appendChild(makeChip(restaurant.category));

    left.appendChild(title);
    left.appendChild(sub);

    const closeIcon = document.createElement("button");
    closeIcon.type = "button";
    closeIcon.setAttribute("aria-label", "닫기");
    closeIcon.textContent = "✕";
    closeIcon.style.width = "28px";
    closeIcon.style.height = "28px";
    closeIcon.style.borderRadius = "10px";
    closeIcon.style.border = "1px solid rgba(0,0,0,0.08)";
    closeIcon.style.background = "white";
    closeIcon.style.cursor = "pointer";
    closeIcon.style.fontSize = "14px";
    closeIcon.style.lineHeight = "1";
    closeIcon.style.opacity = "0.85";
    closeIcon.onclick = (e) => {
      e.stopPropagation();
      clearOverlay();
    };

    header.appendChild(left);
    header.appendChild(closeIcon);

    const addrRow = document.createElement("div");
    addrRow.style.marginTop = "10px";
    addrRow.style.display = "flex";
    addrRow.style.gap = "8px";
    addrRow.style.alignItems = "flex-start";
    addrRow.style.paddingTop = "10px";
    addrRow.style.borderTop = "1px solid rgba(0,0,0,0.06)";

    const pin = document.createElement("div");
    pin.textContent = "📍";
    pin.style.fontSize = "14px";
    pin.style.marginTop = "1px";

    const addr = document.createElement("div");
    addr.textContent = restaurant.address || "주소 정보 없음";
    addr.style.color = "rgba(0,0,0,0.72)";
    addr.style.fontSize = "12.5px";
    addr.style.wordBreak = "keep-all";
    addr.style.overflowWrap = "anywhere";

    addrRow.appendChild(pin);
    addrRow.appendChild(addr);

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.marginTop = "12px";

    const detailBtn = document.createElement("button");
    detailBtn.type = "button";
    detailBtn.textContent = "상세보기";
    detailBtn.style.flex = "1";
    detailBtn.style.padding = "10px 12px";
    detailBtn.style.borderRadius = "12px";
    detailBtn.style.border = "1px solid #111";
    detailBtn.style.background = "#111";
    detailBtn.style.color = "white";
    detailBtn.style.cursor = "pointer";
    detailBtn.style.fontWeight = "800";
    detailBtn.style.letterSpacing = "-0.1px";
    detailBtn.onclick = (e) => {
      e.stopPropagation();
      clearOverlay();
      navigate(`/restaurants/${restaurant.id}`);
    };

    const dismissBtn = document.createElement("button");
    dismissBtn.type = "button";
    dismissBtn.textContent = "닫기";
    dismissBtn.style.padding = "10px 12px";
    dismissBtn.style.borderRadius = "12px";
    dismissBtn.style.border = "1px solid rgba(0,0,0,0.08)";
    dismissBtn.style.background = "white";
    dismissBtn.style.cursor = "pointer";
    dismissBtn.style.fontWeight = "800";
    dismissBtn.onclick = (e) => {
      e.stopPropagation();
      clearOverlay();
    };

    actions.appendChild(detailBtn);
    actions.appendChild(dismissBtn);

    // 오버레이 구성
    wrap.appendChild(header);
    wrap.appendChild(addrRow);
    wrap.appendChild(actions);

    overlayRef.current = new kakao.maps.CustomOverlay({
      position: positionLatLng,
      content: wrap,
      yAnchor: 1.18,
      zIndex: 20,
    });

    overlayRef.current.setMap(map);
  };

  // 지도 초기화(최초 1회)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setMapStatus("loading");
        const kakao = await loadKakaoMaps();
        if (cancelled) return;

        kakaoRef.current = kakao;

        if (!mapRef.current && containerRef.current) {
          const center = new kakao.maps.LatLng(
            DEFAULT_POS.lat,
            DEFAULT_POS.lng,
          );
          mapRef.current = new kakao.maps.Map(containerRef.current, {
            center,
            level: 4,
          });

          kakao.maps.event.addListener(mapRef.current, "click", clearOverlay);
          kakao.maps.event.addListener(
            mapRef.current,
            "dragstart",
            clearOverlay,
          );
        }

        if (!geocoderRef.current) {
          geocoderRef.current = new kakao.maps.services.Geocoder();
        }

        setMapStatus("ready");
      } catch (e) {
        console.error(e);
        setMapStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // 데이터 로드 + 마커 렌더
  useEffect(() => {
    const kakao = kakaoRef.current;
    const map = mapRef.current;

    if (!kakao || !map) return;
    if (mapStatus !== "ready") return;
    if (!loaded) return;
    if (!basePos) return;

    const run = async () => {
      try {
        setApiError(null);
        setLoadingData(true);

        clearRestaurantMarkers();
        setMyLocationPulse(basePos);

        const pageResp = await fetchNearbyRestaurants({
          lat: basePos.lat,
          lng: basePos.lng,
          radiusKm: safeRadiusKm,
          keyword: keyword?.trim() || undefined,
          category,
          page,
          size,
        });

        const raw = pageResp?.content || [];
        const candidates = raw.filter((r) => String(r.address || "").trim());

        const mapped = await mapWithConcurrency(
          candidates,
          async (r) => {
            const coord = await geocodeAddress(r.address);
            if (!coord) return null;
            return { ...r, coord };
          },
          5,
        );

        const okItems = mapped.filter(Boolean);

        const bounds = new kakao.maps.LatLngBounds();
        bounds.extend(new kakao.maps.LatLng(basePos.lat, basePos.lng));

        okItems.forEach((r) => {
          const pos = new kakao.maps.LatLng(r.coord.lat, r.coord.lng);
          bounds.extend(pos);

          const marker = new kakao.maps.Marker({ position: pos });
          marker.setMap(map);

          kakao.maps.event.addListener(marker, "click", () => {
            // 중심으로 이동
            map.panTo(pos);

            // 이동 중에는 overlay가 어색할 수 있으니 살짝 딜레이 후 표시
            setTimeout(() => {
              showRestaurantOverlay(r, pos);
            }, 250);
          });

          markersRef.current.push(marker);
        });

        if (okItems.length > 0) {
          map.setBounds(bounds);
        } else {
          map.setCenter(new kakao.maps.LatLng(basePos.lat, basePos.lng));
        }
      } catch (e) {
        console.error(e);
        setApiError(e?.response?.data?.message || e?.message || String(e));
      } finally {
        setLoadingData(false);
      }
    };

    run();
  }, [mapStatus, loaded, basePos, safeRadiusKm, keyword, category, page, size]);

  // 언마운트 정리
  useEffect(() => {
    return () => {
      clearRestaurantMarkers();
      if (myLocationOverlayRef.current) {
        myLocationOverlayRef.current.setMap(null);
        myLocationOverlayRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색 제출(근처/거리 정렬로 목록 페이지 이동)
  const handleNearbySearchSubmit = (e) => {
    e.preventDefault();
    const kw = q.trim();

    const params = new URLSearchParams();
    if (kw) params.set("keyword", kw);
    params.set("sort", "distance");

    navigate(`/restaurants?${params.toString()}`);
  };

  return (
    <section className="nearby-section">
      <div className="nearby-search-wrap">
        <form className="nearby-search" onSubmit={handleNearbySearchSubmit}>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="내 주변 맛집 검색"
            aria-label="근처 식당 검색"
          />
          <button type="submit">{q.trim() ? "검색" : "전체보기"}</button>
        </form>
      </div>

      {mapStatus === "error" && (
        <div className="nearby-message error">
          지도 로드 실패 (VITE_KAKAO_MAP_KEY 확인)
        </div>
      )}

      {apiError && (
        <div className="nearby-message error">API ERROR: {apiError}</div>
      )}

      {loaded && error && !coords && !useFallbackWhenDenied && (
        <div className="nearby-message info">위치 권한이 필요합니다.</div>
      )}

      <div ref={containerRef} className="nearby-map" style={{ height }} />
    </section>
  );
}
