import { http } from "./http";

export const authApi = {
  login: (payload) => http("/auth/login", { method: "POST", body: payload }),
  register: (payload) => http("/auth/register", { method: "POST", body: payload }),
  logout: (token) => http("/auth/logout", { method: "POST", token }),
  me: (token) => http("/auth/me", { token }),
};