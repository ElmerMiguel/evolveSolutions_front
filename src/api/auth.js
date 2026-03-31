import { http } from "./http";

export const authApi = {
  login: (payload) => http("/auth/login", { method: "POST", body: payload }),
};