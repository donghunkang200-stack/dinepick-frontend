import SkeletonRestaurantCard from "./SkeletonRestaurantCard";

const SkeletonRestaurantGrid = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRestaurantCard key={i} />
      ))}
    </>
  );
};

export default SkeletonRestaurantGrid;
