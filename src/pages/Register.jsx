import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");
    setBusy(true);

    const form = new FormData(e.currentTarget);
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password !== confirmPassword) {
      setBusy(false);
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "No se pudo registrar.");

      setOk("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => nav("/login"), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl shadow-brand-500/20">
        <h1 className="text-center text-2xl font-bold text-brand-700 mb-8">
          Registro
        </h1>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre completo
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Correo electrónico
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="correo@dominio.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Crea una contraseña"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirmar contraseña
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Repite tu contraseña"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
            />
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
              {error}
            </div>
          )}

          {ok && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              {ok}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 transition disabled:opacity-60"
          >
            {busy ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-brand-700 font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}