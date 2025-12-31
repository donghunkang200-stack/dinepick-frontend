import { http } from "./http";

export async function fetchRestaurants({
  keyword = "",
  page = 0,
  size = 10,
} = {}) {
  const params = { page, size };
  if (keyword) params.keyword = keyword;
  const res = await http.get("/api/restaurants", { params });
  return res.data; // Spring Page 형태
}

export async function fetchRestaurantById(id) {
  const res = await http.get(`/api/restaurants/${id}`);
  return res.data;
}
