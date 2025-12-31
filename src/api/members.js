import { http } from "./http";

export async function fetchMe() {
  const res = await http.get("/api/members/me");
  return res.data;
}
