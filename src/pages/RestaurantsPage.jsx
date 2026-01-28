import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import FilterBar from "../components/restaurants/FilterBar";
import RestaurantGrid from "../components/restaurants/RestaurantGrid";
import Pagination from "../components/restaurants/Pagination";
import { fetchRestaurants, fetchNearbyRestaurants } from "../api/restaurants";
import { useGeolocation } from "../hooks/useGeolocation";
import { filterByRegion, paginate } from "../utils/regionFilter";
import SkeletonRestaurantGrid from "../components/restaurants/SkeletonRestaurantGrid";

const PAGE_SIZE = 6;
const NEARBY_RADIUS_KM = 10; // 가까운순 검색 반경(km)

// 지역필터 모드에서 서버에서 미리 가져올 개수(성능 때문에 분리)
// - region만 선택(키워드 없음): 너무 크게 받으면 느림 → 60
// - region + keyword: 결과가 줄어드니 100 정도 가능
const REGION_ONLY_BATCH = 60;
const REGION_WITH_KEYWORD_BATCH = 100;

const RestaurantsPage = () => {
  // URL 쿼리스트링(keyword/category/sort)로 필터 상태를 유지
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 필터값 읽기(없으면 기본값)
  const keyword = searchParams.get("keyword") ?? "";
  const category = searchParams.get("category") ?? "ALL";
  const region = searchParams.get("region") ?? "ALL";

  // 페이지는 내부 state로 관리(0-based)
  const [page, setPage] = useState(0);

  // 정렬 옵션은 URL과 state를 동기화
  const sortFromUrl = searchParams.get("sort") ?? "recommended";
  const [sortOption, setSortOption] = useState(sortFromUrl);

  // 최종 화면 데이터
  const [data, setData] = useState(null);

  // 지역필터 모드용 캐시(페이지 넘겨도 재요청 안 하려고)
  const [regionAllItems, setRegionAllItems] = useState(null); // array

  // API 로딩/안내 메시지 상태
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState(""); // 가까운순에서 위치 상태 안내 + 지역필터 안내

  // 가까운순은 위치 정보가 필요함
  const { loaded: geoLoaded, coords, error: geoError } = useGeolocation();

  const isDistance = sortOption === "distance";
  const hasRegionFilter = region !== "ALL";

  // 지역필터 모드일 때, 서버에서 가져올 배치 크기
  const regionBatchSize = useMemo(() => {
    const hasKeyword = keyword.trim().length > 0;
    return hasKeyword ? REGION_WITH_KEYWORD_BATCH : REGION_ONLY_BATCH;
  }, [keyword]);

  // 필터가 바뀌면 첫 페이지로 되돌림(UX)
  useEffect(() => {
    setPage(0);
  }, [keyword, category, sortOption, region]);

  // URL sort가 바뀌면 state도 따라가게 동기화
  useEffect(() => {
    setSortOption(searchParams.get("sort") ?? "recommended");
  }, [searchParams]);

  // 지역/키워드/카테고리/정렬이 바뀌면 지역필터 캐시 초기화 (새로 받아야 함)
  useEffect(() => {
    setRegionAllItems(null);
  }, [keyword, category, isDistance, region]);

  // 리스트 로딩
  // - region=ALL: 서버 페이지네이션 유지(기존 방식)
  // - region!=ALL: 서버에서 1번만(0페이지) 받아서 regionAllItems에 저장
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setHint("");

      try {
        // 지역필터 모드: 서버 호출은 한 번만
        if (hasRegionFilter) {
          // 이미 캐시가 있으면 API 다시 안 부름
          if (regionAllItems) return;

          // 거리순이면 위치 기반 API 호출
          if (isDistance) {
            if (!geoLoaded) {
              setHint("내 위치를 확인하는 중...");
              setData(null);
              return;
            }

            if (!coords) {
              const msg =
                geoError?.code === 1
                  ? "가까운순 정렬을 위해 위치 권한이 필요합니다."
                  : "내 위치를 가져오지 못했습니다. 위치 설정을 확인해주세요.";
              setHint(msg);

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
              keyword: keyword || undefined,
              category,
              page: 0,
              size: regionBatchSize,
            });

            if (cancelled) return;

            const filtered = filterByRegion(res?.content ?? [], region);
            setHint(`지역 필터 적용: "${region}"`);
            setRegionAllItems(filtered);
            return;
          }

          // 추천순(기본)은 기존 목록 API 호출 (0페이지 batch)
          const res = await fetchRestaurants({
            keyword: keyword || undefined,
            category,
            page: 0,
            size: regionBatchSize,
          });

          if (cancelled) return;

          const filtered = filterByRegion(res?.content ?? [], region);
          setHint(`지역 필터 적용: "${region}"`);
          setRegionAllItems(filtered);
          return;
        }

        // region=ALL: 기존처럼 서버 페이지네이션
        if (isDistance) {
          if (!geoLoaded) {
            setHint("내 위치를 확인하는 중...");
            setData(null);
            return;
          }

          if (!coords) {
            const msg =
              geoError?.code === 1
                ? "가까운순 정렬을 위해 위치 권한이 필요합니다."
                : "내 위치를 가져오지 못했습니다. 위치 설정을 확인해주세요.";
            setHint(msg);

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
            keyword: keyword || undefined,
            category,
            page,
            size: PAGE_SIZE,
          });

          if (cancelled) return;
          setData(res);
          return;
        }

        const res = await fetchRestaurants({
          keyword: keyword || undefined,
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
    // page는 region=ALL일 때만 의미있어서 그대로 두되,
    // hasRegionFilter일 때는 regionAllItems가 캐시되면 더 이상 재요청 안 함
  }, [
    keyword,
    category,
    page,
    isDistance,
    geoLoaded,
    coords,
    geoError,
    hasRegionFilter,
    region,
    regionBatchSize,
    regionAllItems,
  ]);

  // 지역필터 모드일 때는 로컬 페이지네이션으로 화면 data 구성
  useEffect(() => {
    if (!hasRegionFilter) return;
    if (!regionAllItems) {
      setData(null);
      return;
    }

    setData(paginate(regionAllItems, page, PAGE_SIZE));
  }, [hasRegionFilter, regionAllItems, page]);

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
          {keyword || hasRegionFilter
            ? `"${[region !== "ALL" ? region : "", keyword].filter(Boolean).join(" ")}" 검색 결과`
            : "Restaurants"}
        </h1>

        <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
          {totalElements} results found
        </p>

        <FilterBar
          keyword={keyword}
          region={region}
          selectedCategory={category}
          sortOption={sortOption}
          onRegionChange={({ region: nextRegion }) => {
            // 지역 변경을 URL에 반영(ALL이면 region 제거)
            const params = new URLSearchParams(searchParams);
            if (nextRegion === "ALL") params.delete("region");
            else params.set("region", nextRegion);
            params.set("page", "0");
            setSearchParams(params);
          }}
          onCategoryChange={({ category: nextCategory }) => {
            // 카테고리 변경을 URL에 반영(ALL이면 파라미터 제거)
            const params = new URLSearchParams(searchParams);
            if (nextCategory === "ALL") params.delete("category");
            else params.set("category", nextCategory);
            params.set("page", "0");
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

        {/* 거리순에서 위치 상태 안내 문구 / 지역필터 안내 */}
        {hint && (
          <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
            {hint}
          </div>
        )}

        <div className="grid-crossfade">
          <div
            className={`grid-layer skeleton ${loading ? "show" : ""}`}
            aria-hidden={!loading}
          >
            <RestaurantGrid>
              <SkeletonRestaurantGrid count={PAGE_SIZE} />
            </RestaurantGrid>
          </div>

          <div
            className={`grid-layer real ${!loading ? "show" : ""}`}
            aria-hidden={loading}
          >
            <RestaurantGrid items={items} />
          </div>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(next) => setPage(next)}
          windowSize={5}
        />
      </div>
    </Layout>
  );
};

export default RestaurantsPage;
