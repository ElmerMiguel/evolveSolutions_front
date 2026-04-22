import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  setLayout,
  useLayoutController,
} from "../../contexts/layout/LayoutContext.jsx";
import { http } from "../../api/http.js";
import { useAuth } from "../../contexts/auth/AuthContext.jsx";
import { useErrorSnackbar } from "../../contexts/error/ErrorSnackbarProvider.jsx";

const ESTADOS_FINALES = ["APPROVED", "REJECTED"];
const ESTADOS_DISPONIBLES = [
  { value: "SUBMITTED", label: "Recibida" },
  { value: "UNDER_REVIEW", label: "En revisión" },
  { value: "APPROVED", label: "Aprobada" },
  { value: "REJECTED", label: "Rechazada" },
];

function getEstadoLabel(estado) {
  const encontrado = ESTADOS_DISPONIBLES.find((item) => item.value === estado);
  return encontrado ? encontrado.label : estado;
}

function mapSolicitudFromApi(solicitud) {
  return {
    id: solicitud.id,
    estado: solicitud.estado,
    nombre: solicitud.nombre,
    carnet: solicitud.carnet,
    carrera: solicitud.carrera,
    cursoAprobado: solicitud.cursoaprobado,
    codigoCursoAprobado: solicitud.codigocursoaprobado,
    cursoEquivalencia: solicitud.cursoequivalencia,
    codigoCursoEquivalencia: solicitud.codigocursoequivalencia,
    cantidadArchivos: solicitud.cantidadarchivos,
  };
}

export default function CambioEstadoSolicitud() {
  const navigate = useNavigate();
  const [, dispatch] = useLayoutController();
  const { rol } = useAuth();
  const { showError, showSuccess } = useErrorSnackbar();
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudId, setSolicitudId] = useState("");
  const [estado, setEstado] = useState(ESTADOS_DISPONIBLES[0].value);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [dispatch]);

  useEffect(() => {
    void fetchSolicitudes();
  }, []);

  async function fetchSolicitudes() {
    setLoading(true);

    try {
      const res = await http("/equivalencias", { method: "GET" });

      if (res.status !== 200) {
        throw new Error(
          res.data?.error || res.data?.message || "No se pudieron cargar las solicitudes"
        );
      }

      const solicitudesMapeadas = Array.isArray(res.data)
        ? res.data.map(mapSolicitudFromApi)
        : [];

      setSolicitudes(solicitudesMapeadas);
    } catch (error) {
      showError(error?.message || "Error al cargar solicitudes");
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  }

  const solicitudesAbiertas = useMemo(
    () =>
      solicitudes.filter(
        (solicitud) => !ESTADOS_FINALES.includes(solicitud.estado)
      ),
    [solicitudes]
  );

  useEffect(() => {
    if (!solicitudesAbiertas.length) {
      setSolicitudId("");
      return;
    }

    const existeSolicitudSeleccionada = solicitudesAbiertas.some(
      (solicitud) => String(solicitud.id) === solicitudId
    );

    if (!existeSolicitudSeleccionada) {
      setSolicitudId(String(solicitudesAbiertas[0].id));
      setEstado(solicitudesAbiertas[0].estado || ESTADOS_DISPONIBLES[0].value);
    }
  }, [solicitudId, solicitudesAbiertas]);

  if (rol !== "SECRETARY" && rol !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  const solicitudSeleccionada = solicitudesAbiertas.find(
    (solicitud) => String(solicitud.id) === solicitudId
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!solicitudId || !estado) return;

    setSaving(true);

    try {
      const res = await http(`/equivalencias/${solicitudId}/status`, {
        method: "PATCH",
        body: {
          status_name: estado,
          change_reason: null,
        },
      });

      if (res.status !== 200) {
        throw new Error(
          res.data?.error || res.data?.message || "No se pudo actualizar el estado"
        );
      }

      const nextStatus = res.data?.new_status || estado;

      setSolicitudes((prev) =>
        prev.map((solicitud) =>
          String(solicitud.id) === solicitudId
            ? {
                ...solicitud,
                estado: nextStatus,
              }
            : solicitud
        )
      );

      setEstado(nextStatus);
      showSuccess(
        res.data?.message || "Estado actualizado correctamente"
      );
    } catch (error) {
      showError(error?.message || "Error al actualizar el estado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Cambio de Estado
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Secretaría puede actualizar el estado de las solicitudes abiertas.
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
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
              Cargando solicitudes...
            </div>
          ) : !solicitudesAbiertas.length ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
              No hay solicitudes abiertas para actualizar.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Solicitud abierta
                </label>
                <select
                  value={solicitudId}
                  onChange={(event) => {
                    const nextId = event.target.value;
                    const nextSolicitud = solicitudesAbiertas.find(
                      (solicitud) => String(solicitud.id) === nextId
                    );

                    setSolicitudId(nextId);
                    setEstado(nextSolicitud?.estado || ESTADOS_DISPONIBLES[0].value);
                  }}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  {solicitudesAbiertas.map((solicitud) => (
                    <option key={solicitud.id} value={solicitud.id}>
                      {solicitud.nombre} - {solicitud.carnet} -{" "}
                      {solicitud.cursoEquivalencia}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nuevo estado
                </label>
                <select
                  value={estado}
                  onChange={(event) => setEstado(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  {ESTADOS_DISPONIBLES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {solicitudSeleccionada && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">
                      Solicitud:
                    </span>{" "}
                    {solicitudSeleccionada.nombre}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-slate-800">
                      Curso a equivaler:
                    </span>{" "}
                    {solicitudSeleccionada.cursoEquivalencia} (
                    {solicitudSeleccionada.codigoCursoEquivalencia})
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-slate-800">
                      Estado actual:
                    </span>{" "}
                    {getEstadoLabel(solicitudSeleccionada.estado)}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Confirmar cambio"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
