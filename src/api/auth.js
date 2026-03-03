import { http } from "./http";

export const authApi = {
  login: (payload) => http("/api/auth/login", { method: "POST", body: payload }),
  register: (payload) => http("/api/auth/register", { method: "POST", body: payload }),
  logout: (token) => http("/api/auth/logout", { method: "POST", token }),
  me: (token) => http("/api/me", { token }),
};