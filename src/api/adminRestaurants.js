import { http } from "./api";

// 레스토랑 수집 API
// 카카오맵에서 keyword로 검색한 결과를 백엔드 DB에 저장
// POST /api/admin/restaurants/import?keyword=...
export async function importRestaurantsByKeyword(keyword) {
  const k = keyword?.trim();
  if (!k) throw new Error("keyword is required");

  const res = await http.post(
    `/api/admin/restaurants/import?keyword=${encodeURIComponent(k)}`,
  );

  //res.data는 문자열
  return res.data;
}

// 문자열 트리밍: "저장 완료: 27건" -> 27
export function parseSavedCount(message) {
  if (typeof message !== "string") return null;
  const m = message.match(/(\d+)\s*건/);
  return m ? Number(m[1]) : null;
}

// 목록 조회
export async function fetchAdminRestaurants({
  keyword = "",
  page = 0,
  size = 20,
} = {}) {
  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  params.set("page", String(page));
  params.set("size", String(size));

  const res = await http.get(`/api/admin/restaurants?${params.toString()}`);
  return res.data;
}

// 삭제
export async function deleteAdminRestaurant(id) {
  const res = await http.delete(`/api/admin/restaurants/${id}`);
  return res.data;
}
