import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { fetchRestaurantById, fetchRestaurants } from "../api/restaurants";
import DetailPageSkeleton from "../components/restaurant-detail/DetailPageSkeleton";
import DetailHero from "../components/restaurant-detail/DetailHero";
import DetailInfoCard from "../components/restaurant-detail/DetailInfoCard";
import DetailMapCard from "../components/restaurant-detail/DetailMapCard";
import DetailReservationPanel from "../components/restaurant-detail/DetailReservationPanel";
import DetailRelatedSection from "../components/restaurant-detail/DetailRelatedSection";
import "./RestaurantDetailPage.css";

// 식당 상세 페이지: id로 상세 조회하고, 화면을 섹션 컴포넌트들로 조립해서 보여줌
const RestaurantDetailPage = () => {
  // URL 파라미터에서 식당 id 가져옴 (/restaurants/:id)
  const { id } = useParams();

  // 상세 데이터 상태
  const [restaurant, setRestaurant] = useState(null);

  // 관련 레스토랑(임시) 상태
  const [relatedItems, setRelatedItems] = useState([]);

  // 로딩/없음(에러) 상태
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // 상세 불러오기: id 바뀌면 해당 식당 상세를 다시 조회
  useEffect(() => {
    let alive = true; // 언마운트 후 setState 방지용 플래그
    setLoading(true);
    setNotFound(false);

    fetchRestaurantById(id)
      .then((data) => {
        if (!alive) return;
        setRestaurant(data);
      })
      .catch(() => {
        if (!alive) return;
        setNotFound(true);
        setRestaurant(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  // 관련 레스토랑 불러오기(임시): 목록 6개 중 현재 id 제외하고 3개만 추림
  useEffect(() => {
    let alive = true;

    fetchRestaurants({ page: 0, size: 6 })
      .then((pageData) => {
        if (!alive) return;

        const items = (pageData?.content ?? [])
          // 현재 보고 있는 식당은 제외
          .filter((x) => String(x.id) !== String(id))
          // 최대 3개만 노출
          .slice(0, 3);

        setRelatedItems(items);
      })
      .catch(() => {
        if (!alive) return;
        setRelatedItems([]);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  // 로딩 중이면 로딩 화면 렌더
  if (loading) {
    return (
      <Layout>
        <div className="container">
          <DetailPageSkeleton />
        </div>
      </Layout>
    );
  }

  // 상세가 없거나(404/에러) 데이터가 비었으면 not found 화면 렌더
  if (notFound || !restaurant) {
    return (
      <Layout>
        <div className="container detail-container">
          <h2 className="detail-not-found-title">Restaurant not found</h2>
        </div>
      </Layout>
    );
  }

  // 정상일 때: 상세 페이지 섹션들을 조립해서 렌더
  return (
    <Layout>
      <div className="container detail-container">
        {/* 상단 히어로(대표 이미지 + 제목 영역) */}
        <DetailHero restaurant={restaurant} />

        <section className="detail-grid">
          {/* 왼쪽: 정보/지도/관련 */}
          <div className="detail-left">
            <DetailInfoCard restaurant={restaurant} />
            <DetailMapCard restaurant={restaurant} />
            <DetailRelatedSection items={relatedItems} />
          </div>

          {/* 오른쪽: 예약 패널(데스크톱 sticky) */}
          <aside className="detail-right">
            <DetailReservationPanel restaurant={restaurant} />
          </aside>
        </section>
      </div>
    </Layout>
  );
};

export default RestaurantDetailPage;
