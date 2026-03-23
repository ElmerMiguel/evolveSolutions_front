import { useNavigate } from "react-router-dom";
import {useEffect} from "react";
import {useAuth} from "../contexts/auth/AuthContext.jsx";
import {setLayout, useLayoutController} from "../contexts/layout/LayoutContext.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [, dispatch] = useLayoutController();

    useEffect(() => {
        if (!token) {
            navigate("/landing");
        }
        setLayout(dispatch, "dashboard");
    }, []);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-600">Sesión iniciada correctamente</p>
            </div>

          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Token</p>
            <p className="mt-2 break-all text-xs text-slate-600">
              {token ? token.slice(0, 180) + "..." : "No token"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}