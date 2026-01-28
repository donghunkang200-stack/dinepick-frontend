import { http } from "./api";

// 로그인된 회원 정보 조회(마이페이지) API
export async function fetchMe() {
  const res = await http.get("/api/members/me");
  return res.data;
}
// 로그인된 회원 정보 수정 API
export async function updateMe(payload) {
  const res = await http.put("/api/members/me", payload);
  return res.data;
}
// 로그인된 회원 탈퇴 API
export async function withdrawMe() {
  const res = await http.delete("/api/members/me");
  return res.data; // 204면 undefined
}

// 관리자: 전체 회원
export async function adminFetchMembers() {
  const res = await http.get("/api/members");
  return res.data; // List<MemberResponse>
}

// 관리자: 단건 조회
export async function adminFetchMember(id) {
  const res = await http.get(`/api/members/${id}`);
  return res.data;
}

// 관리자: 탈퇴 회원 목록
export async function adminFetchWithdrawnMembers() {
  const res = await http.get("/api/members/withdrawn");
  return res.data;
}

// 관리자: 복구
export async function adminRestoreMember(id) {
  const res = await http.post(`/api/members/${id}/restore`);
  return res.data;
}
