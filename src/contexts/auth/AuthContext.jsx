import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [user, setUser] = useState(null);
    const [rol, setRol] = useState(localStorage.getItem("rol") || "");
    const permisosInStorage = () => {
        try {
            return JSON.parse(localStorage.getItem("permisos") || "[]");
        } catch {
            return [];
        }
    };
    const [permisos, setPermisos] = useState(permisosInStorage());

    async function login(payload) {
        const response = await authApi.login(payload);

        const data = response.data;

        const t = data.token;
        if (!t) throw new Error("El backend no devolvió token");

        setToken(t);
        const userRole = data.session?.user?.role || "STUDENT";
        setRol(userRole);

        const backendPermisos = data.permisos || [];
        setPermisos(backendPermisos);

        localStorage.setItem("token", t);
        localStorage.setItem("permisos", JSON.stringify(backendPermisos));
        localStorage.setItem("rol", userRole);

        if (data.session?.user) {
            setUser(data.session.user);
            localStorage.setItem("user", JSON.stringify(data.session.user));
        }

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
        () => ({
            token,
            user,
            setUser,
            login,
            register,
            logout,
            rol,
            permisos,
        }),
        [token, user, rol, permisos]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
