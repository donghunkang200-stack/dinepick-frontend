import { http } from "./http";

export async function signup({ email, password, name }) {
  const res = await http.post("/api/auth/signup", { email, password, name });
  return res.data; // "회원가입 성공"
}

export async function login({ email, password }) {
  const res = await http.post("/api/auth/login", { email, password });
  return res.data; // { accessToken }
}
