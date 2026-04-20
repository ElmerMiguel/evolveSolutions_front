import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import { http } from "../../api/http.js";
import { useErrorSnackbar } from "../../contexts/error/ErrorSnackbarProvider.jsx";

const CARRERAS = [
  { code: "SIS", label: "Ingeniería en Ciencias y Sistemas" },
  { code: "CIV", label: "Ingeniería Civil" },
  { code: "IND", label: "Ingeniería Industrial" },
  { code: "MEC", label: "Ingeniería Mecánica" },
  { code: "MEC_IND", label: "Ingeniería Mecánica Industrial" },
];

export default function SolicitudEquivalencia() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError } = useErrorSnackbar();

  const [form, setForm] = useState({
    nombre: "",
    carnet: "",
    carrera: "",
    cursoAprobado: "",
    codigoCursoAprobado: "",
    cursoEquivalencia: "",
    codigoCursoEquivalencia: "",
    observaciones: "",
  });

  const [errores, setErrores] = useState({});
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(false);

  useEffect(() => {
    void fetchCursos();
  }, []);

  async function fetchCursos() {
    setLoadingCursos(true);
    try {
      const res = await http("/cursos", { method: "GET" });
      setCursos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      showError(error?.message ?? "Error al cargar cursos");
    } finally {
      setLoadingCursos(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleCursoAprobadoChange(e) {
    const selected = cursos.find((curso) => curso.code === e.target.value);

    setForm((prev) => ({
      ...prev,
      cursoAprobado: selected?.name || "",
      codigoCursoAprobado: selected?.code || "",
    }));
  }

  function validar() {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    } else if (form.nombre.trim().length < 5) {
      nuevosErrores.nombre = "El nombre debe tener al menos 5 caracteres";
    }

    if (!form.carnet.trim()) {
      nuevosErrores.carnet = "El carnet es obligatorio";
    } else if (!/^\d+$/.test(form.carnet.trim())) {
      nuevosErrores.carnet = "El carnet solo debe contener números";
    }

    if (!form.carrera.trim()) {
      nuevosErrores.carrera = "La carrera es obligatoria";
    }

    if (!form.cursoAprobado.trim()) {
      nuevosErrores.cursoAprobado = "El curso aprobado es obligatorio";
    }

    if (!form.codigoCursoAprobado.trim()) {
      nuevosErrores.codigoCursoAprobado = "El código del curso aprobado es obligatorio";
    } else if (form.codigoCursoAprobado.trim().length < 2) {
      nuevosErrores.codigoCursoAprobado = "El código del curso aprobado no es válido";
    }

    if (!form.cursoEquivalencia.trim()) {
      nuevosErrores.cursoEquivalencia = "El curso a equivaler es obligatorio";
    }

    if (!form.codigoCursoEquivalencia.trim()) {
      nuevosErrores.codigoCursoEquivalencia = "El código del curso a equivaler es obligatorio";
    } else if (form.codigoCursoEquivalencia.trim().length < 2) {
      nuevosErrores.codigoCursoEquivalencia = "El código del curso a equivaler no es válido";
    }

    if (form.observaciones.trim().length > 300) {
      nuevosErrores.observaciones = "Las observaciones no deben exceder 300 caracteres";
    }

    return nuevosErrores;
  }

  function obtenerCorreoEstudiante() {
    if (typeof user?.email === "string" && user.email.trim()) {
      return user.email.trim();
    }

    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem("user") || "null");

      if (
        typeof usuarioGuardado?.email === "string" &&
        usuarioGuardado.email.trim()
      ) {
        return usuarioGuardado.email.trim();
      }
    } catch {}

    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    const nuevaSolicitud = {
      id: Date.now(),
      ...form,
      correo: obtenerCorreoEstudiante(),
      estado: "En revisión",
      fechaSolicitud: new Date().toISOString(),
      cantidadArchivos: 0,
    };

    const solicitudesGuardadas =
      JSON.parse(localStorage.getItem("solicitudes")) || [];

    solicitudesGuardadas.push(nuevaSolicitud);

    localStorage.setItem("solicitudes", JSON.stringify(solicitudesGuardadas));
    localStorage.setItem("solicitudActivaId", String(nuevaSolicitud.id));

    setForm({
      nombre: "",
      carnet: "",
      carrera: "",
      cursoAprobado: "",
      codigoCursoAprobado: "",
      cursoEquivalencia: "",
      codigoCursoEquivalencia: "",
      observaciones: "",
    });

    navigate("/carga-archivos");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Solicitud de Equivalencia
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Complete la información para registrar una nueva solicitud.
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Volver al dashboard
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nombre completo
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="Ingrese el nombre completo"
              />
              {errores.nombre && (
                <p className="mt-2 text-sm text-red-600">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Carnet
              </label>
              <input
                type="text"
                name="carnet"
                value={form.carnet}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="Ingrese el carnet"
              />
              {errores.carnet && (
                <p className="mt-2 text-sm text-red-600">{errores.carnet}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Carrera
              </label>
              <select
                name="carrera"
                value={form.carrera}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="">Seleccione una carrera</option>
                {CARRERAS.map((carrera) => (
                  <option key={carrera.code} value={carrera.label}>
                    {carrera.label}
                  </option>
                ))}
              </select>
              {errores.carrera && (
                <p className="mt-2 text-sm text-red-600">{errores.carrera}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Curso aprobado
              </label>
              <select
                value={form.codigoCursoAprobado}
                onChange={handleCursoAprobadoChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                disabled={loadingCursos}
              >
                <option value="">
                  {loadingCursos ? "Cargando cursos..." : "Seleccione un curso"}
                </option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.code}>
                    {curso.code} - {curso.name}
                  </option>
                ))}
              </select>
              {errores.cursoAprobado && (
                <p className="mt-2 text-sm text-red-600">{errores.cursoAprobado}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Código del curso aprobado
              </label>
              <input
                type="text"
                name="codigoCursoAprobado"
                value={form.codigoCursoAprobado}
                readOnly
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="Seleccione un curso aprobado"
              />
              {errores.codigoCursoAprobado && (
                <p className="mt-2 text-sm text-red-600">
                  {errores.codigoCursoAprobado}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Curso a equivaler
              </label>
              <input
                type="text"
                name="cursoEquivalencia"
                value={form.cursoEquivalencia}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="Ingrese el curso a equivaler"
              />
              {errores.cursoEquivalencia && (
                <p className="mt-2 text-sm text-red-600">
                  {errores.cursoEquivalencia}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Código del curso a equivaler
              </label>
              <input
                type="text"
                name="codigoCursoEquivalencia"
                value={form.codigoCursoEquivalencia}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="Ingrese el código del curso a equivaler"
              />
              {errores.codigoCursoEquivalencia && (
                <p className="mt-2 text-sm text-red-600">
                  {errores.codigoCursoEquivalencia}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={form.observaciones}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                placeholder="Ingrese observaciones adicionales"
              />
              {errores.observaciones && (
                <p className="mt-2 text-sm text-red-600">{errores.observaciones}</p>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
              >
                Continuar con archivos
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
