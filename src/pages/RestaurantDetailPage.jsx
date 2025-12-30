import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { RESTAURANT_ITEMS, getRestaurantById } from "../data/restaurants";
import DetailHero from "../components/restaurant-detail/DetailHero";
import DetailInfoCard from "../components/restaurant-detail/DetailInfoCard";
import DetailMenuCard from "../components/restaurant-detail/DetailMenuCard";
import DetailMapCard from "../components/restaurant-detail/DetailMapCard";
import DetailReviewsCard from "../components/restaurant-detail/DetailReviewsCard";
import DetailReservationPanel from "../components/restaurant-detail/DetailReservationPanel";
import DetailRelatedSection from "../components/restaurant-detail/DetailRelatedSection";
import "./RestaurantDetailPage.css";

/*
  RestaurantDetailPage
  - Container page that composes sections
*/
const RestaurantDetailPage = () => {
  const { id } = useParams();

  const restaurant = useMemo(() => getRestaurantById({ id }), [id]);

  const relatedItems = useMemo(() => {
    if (!restaurant) return [];
    return RESTAURANT_ITEMS.filter((item) => item.id !== restaurant.id).slice(
      0,
      3
    );
  }, [restaurant]);

  if (!restaurant) {
    return (
      <Layout>
        <div className="container detail-container">
          <h2 className="detail-not-found-title">Restaurant not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container detail-container">
        <DetailHero restaurant={restaurant} />

        <section className="detail-grid">
          <div className="detail-left">
            <DetailInfoCard restaurant={restaurant} />
            <DetailMenuCard restaurant={restaurant} />
            <DetailMapCard restaurant={restaurant} />
            <DetailReviewsCard restaurant={restaurant} />
            <DetailRelatedSection items={relatedItems} />
          </div>

          <aside className="detail-right">
            <DetailReservationPanel restaurant={restaurant} />
          </aside>
        </section>
      </div>
    </Layout>
  );
};

export default RestaurantDetailPage;
