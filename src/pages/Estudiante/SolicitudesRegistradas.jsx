import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("solicitudes");
    if (data) {
      setSolicitudes(JSON.parse(data));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Solicitudes Registradas
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Visualiza las solicitudes de equivalencia registradas en el sistema.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/dashboard"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Volver al dashboard
              </Link>

              <Link
                to="/solicitud-equivalencia"
                className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Nueva solicitud
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          {solicitudes.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
              No hay solicitudes registradas todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800">Nombre</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800">Carnet</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800">Carrera</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800">Curso aprobado</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800">Curso a equivaler</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800">Archivos</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800">Estado</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map((solicitud) => (
                    <tr key={solicitud.id} className="border-b border-slate-100">
                      <td className="px-4 py-3 text-sm text-slate-700">{solicitud.nombre}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{solicitud.carnet}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{solicitud.carrera}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {solicitud.cursoAprobado} ({solicitud.codigoCursoAprobado})
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {solicitud.cursoEquivalencia} ({solicitud.codigoCursoEquivalencia})
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {solicitud.cantidadArchivos || 0}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                          {solicitud.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link
                          to={`/solicitudes/${solicitud.id}`}
                          className="inline-flex rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}