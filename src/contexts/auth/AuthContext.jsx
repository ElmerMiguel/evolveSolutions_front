import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(localStorage.getItem("rol") || "");
  // const [permisos, setPermisos] = useState(localStorage.getItem("permisos") || []);
  const [permisos, setPermisos] = useState([{ PermisoID: "cursos", NivelEscritura: 3 }]);


    async function login(payload) {
    const data = await authApi.login(payload);
    const t = data.accessToken || data.token;
    if (!t) throw new Error("El backend no devolvió token (accessToken/token)");

    setToken(t);
    setRol(t?.rol);
    setPermisos(t?.permisos || []);
    localStorage.setItem("token", t);
    localStorage.setItem("permisos", JSON.parse(t?.permisos || []));
    localStorage.setItem("rol", t?.rol);
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
    localStorage.removeItem("permisos");
    localStorage.removeItem("rol");
  }

  const value = useMemo(
    () => ({ token, user, setUser, login, register, logout, rol, permisos }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}