import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import FilterBar from "../components/restaurants/FilterBar";
import RestaurantGrid from "../components/restaurants/RestaurantGrid";
import Pagination from "../components/restaurants/Pagination";
import { fetchRestaurants, fetchNearbyRestaurants } from "../api/restaurants";
import { useGeolocation } from "../hooks/useGeolocation";

const PAGE_SIZE = 6;
const NEARBY_RADIUS_KM = 10; // 가까운순 검색 반경(km)

const RestaurantsPage = () => {
  // URL 쿼리스트링(keyword/category/sort)로 필터 상태를 유지
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 필터값 읽기(없으면 기본값)
  const keyword = searchParams.get("keyword") ?? "";
  const category = searchParams.get("category") ?? "ALL";

  // 페이지는 내부 state로 관리(0-based)
  const [page, setPage] = useState(0);

  // 정렬 옵션은 URL과 state를 동기화
  const sortFromUrl = searchParams.get("sort") ?? "recommended";
  const [sortOption, setSortOption] = useState(sortFromUrl);

  // API 응답/로딩/안내 메시지 상태
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(""); // 가까운순에서 위치 상태 안내

  // 가까운순은 위치 정보가 필요함
  const { loaded: geoLoaded, coords, error: geoError } = useGeolocation();

  const isDistance = sortOption === "distance";

  // 필터가 바뀌면 첫 페이지로 되돌림(UX)
  useEffect(() => {
    setPage(0);
  }, [keyword, category, sortOption]);

  // URL sort가 바뀌면 state도 따라가게 동기화
  useEffect(() => {
    setSortOption(searchParams.get("sort") ?? "recommended");
  }, [searchParams]);

  // 리스트 로딩: 추천순은 fetchRestaurants, 가까운순은 fetchNearbyRestaurants 사용
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setHint("");

      try {
        // 거리순이면 위치 기반 API 호출
        if (isDistance) {
          // 위치 아직 로딩 중이면 대기 상태로 안내만 표시
          if (!geoLoaded) {
            setHint("내 위치를 확인하는 중...");
            setData(null);
            return;
          }

          // 위치 로딩은 끝났지만 coords가 없으면(권한 거부/실패 등)
          if (!coords) {
            const msg =
              geoError?.code === 1
                ? "가까운순 정렬을 위해 위치 권한이 필요합니다."
                : "내 위치를 가져오지 못했습니다. 위치 설정을 확인해주세요.";
            setHint(msg);

            // 화면이 깨지지 않도록 빈 페이지 형태로 세팅
            setData({
              content: [],
              totalPages: 1,
              totalElements: 0,
              number: 0,
            });
            return;
          }

          const res = await fetchNearbyRestaurants({
            lat: coords.lat,
            lng: coords.lng,
            radiusKm: NEARBY_RADIUS_KM,
            keyword,
            category,
            page,
            size: PAGE_SIZE,
          });

          if (cancelled) return;
          setData(res);
          return;
        }

        // 추천순(기본)은 기존 목록 API 호출
        const res = await fetchRestaurants({
          keyword,
          category,
          page,
          size: PAGE_SIZE,
        });

        if (cancelled) return;
        setData(res);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [keyword, category, page, isDistance, geoLoaded, coords, geoError]);

  // 검색어 제출: 비면 keyword 제거(전체보기), 있으면 keyword 갱신
  const handleKeywordSubmit = (nextKeyword) => {
    const params = new URLSearchParams(searchParams);

    if (!nextKeyword) params.delete("keyword");
    else params.set("keyword", nextKeyword);

    setSearchParams(params);
  };

  const items = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

  return (
    <Layout>
      <div className="container" style={{ padding: "22px 0" }}>
        <h1 style={{ margin: "0 0 6px", letterSpacing: "-0.3px" }}>
          {keyword ? `"${keyword}" 검색 결과` : "Restaurants"}
        </h1>
        <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
          {totalElements} results found
        </p>
        <FilterBar
          keyword={keyword}
          selectedCategory={category}
          sortOption={sortOption}
          onCategoryChange={({ category: nextCategory }) => {
            // 카테고리 변경을 URL에 반영(ALL이면 파라미터 제거)
            const params = new URLSearchParams(searchParams);
            if (nextCategory === "ALL") params.delete("category");
            else params.set("category", nextCategory);
            setSearchParams(params);
          }}
          onSortChange={({ sort }) => {
            // 정렬 변경을 URL에 반영(추천순이면 sort 제거)
            const params = new URLSearchParams(searchParams);
            params.set("page", "0");
            if (sort === "recommended") params.delete("sort");
            else params.set("sort", sort);
            setSearchParams(params);
          }}
          onKeywordSubmit={handleKeywordSubmit}
        />
        {/* 거리순에서 위치 상태 안내 문구 */}
        {hint && (
          <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
            {hint}
          </div>
        )}
        {loading ? (
          <div style={{ padding: 20 }}>불러오는 중...</div>
        ) : (
          <RestaurantGrid items={items} />
        )}
        <Pagination
          page={page}
          totalPages={data?.totalPages ?? 0}
          onChange={(next) => setPage(next)}
          windowSize={5}
        />
      </div>
    </Layout>
  );
};

export default RestaurantsPage;
