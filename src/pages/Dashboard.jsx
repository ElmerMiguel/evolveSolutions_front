import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    nav("/login");
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

            <button
              onClick={logout}
              className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700"
            >
              Cerrar sesión
            </button>
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