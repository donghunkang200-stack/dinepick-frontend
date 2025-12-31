import { useMemo, useState } from "react";
import Layout from "../components/layout/Layout";
import ProfileBanner from "../components/mypage/ProfileBanner";
import StatsCards from "../components/mypage/StatsCards";
import MyPageTabs from "../components/mypage/MyPageTabs";
import ReservationsSection from "../components/mypage/ReservationsSection";
import FavoritesSection from "../components/mypage/FavoritesSection";
import ReviewsSection from "../components/mypage/ReviewsSection";
import "./MyPage.css";

/*
  MyPage
  - Profile banner + stats + tabs + content sections
*/
const MyPage = () => {
  const [activeTab, setActiveTab] = useState("reservations");

  const user = useMemo(() => {
    return {
      name: "홍길동님",
      subtitle: "캐치테이블과 같은 레스토랑 예약 서비스",
    };
  }, []);

  const stats = useMemo(() => {
    return {
      reservations: 1,
      favorites: 2,
      reviews: 2,
    };
  }, []);

  const upcomingReservations = useMemo(() => {
    return [
      {
        id: "up-1",
        title: "스시 오마카세",
        date: "2025.01.05",
        time: "19:00",
        people: 2,
        status: "예약 확정",
        imageUrl:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
      },
    ];
  }, []);

  const pastReservations = useMemo(() => {
    return [
      {
        id: "past-1",
        title: "미슐랭 한식당",
        date: "2024.12.15",
        time: "18:30",
        people: 4,
        status: "방문 완료",
        imageUrl:
          "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop",
      },
    ];
  }, []);

  const favorites = useMemo(() => {
    return [
      {
        id: "fav-1",
        name: "Cherry Table",
        region: "부산",
        category: "Cafe",
        rating: 4.5,
        imageUrl:
          "https://images.unsplash.com/photo-1528826194825-8d3b4ee31c06?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "fav-2",
        name: "Izakaya Night",
        region: "서울",
        category: "Japanese",
        rating: 4.4,
        imageUrl:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop",
      },
    ];
  }, []);

  const reviews = useMemo(() => {
    return [
      {
        id: "rev-1",
        restaurant: "미슐랭 한식당",
        rating: 5,
        date: "2024.12.20",
        content:
          "음식이 정말 맛있고 분위기도 좋았습니다. 특히 된장찌개가 일품이었어요!",
      },
      {
        id: "rev-2",
        restaurant: "이자카야 나이트",
        rating: 4,
        date: "2024.12.18",
        content: "가성비가 좋고 친절했어요. 재방문 의사 있습니다.",
      },
    ];
  }, []);

  return (
    <Layout>
      <div className="container mypage">
        <ProfileBanner user={user} />

        <StatsCards stats={stats} />

        <MyPageTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {activeTab === "reservations" && (
          <ReservationsSection
            upcomingReservations={upcomingReservations}
            pastReservations={pastReservations}
          />
        )}

        {activeTab === "favorites" && (
          <FavoritesSection favorites={favorites} />
        )}

        {activeTab === "reviews" && <ReviewsSection reviews={reviews} />}
      </div>
    </Layout>
  );
};

export default MyPage;
