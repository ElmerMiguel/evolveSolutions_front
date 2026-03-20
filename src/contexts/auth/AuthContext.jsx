import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../../api/auth.js";
import {useLocation, useNavigate} from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

    async function login(payload) {
    const data = await authApi.login(payload);
    const t = data.accessToken || data.token;
    if (!t) throw new Error("El backend no devolvió token (accessToken/token)");

    setToken(t);
    localStorage.setItem("token", t);
    setUser(data.user || null);
    return data;
  }

  async function register(payload) {
    return authApi.register(payload);
  }

  async function logout() {
    try {
      if (token) await authApi.logout(token);
    } catch {}
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
  }

  const value = useMemo(
    () => ({ token, user, setUser, login, register, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}