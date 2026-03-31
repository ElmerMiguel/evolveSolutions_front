import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";

export default function DetalleSolicitud() {
  const { id } = useParams();

  const solicitud = useMemo(() => {
    const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
    return solicitudes.find((item) => item.id === Number(id));
  }, [id]);

  const documentos = useMemo(() => {
    const archivos = JSON.parse(localStorage.getItem("archivosSolicitud")) || [];
    return archivos.filter((archivo) => archivo.solicitudId === Number(id));
  }, [id]);

  function formatearTamanio(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleString();
  }

  if (!solicitud) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-slate-900">
              Solicitud no encontrada
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              No fue posible encontrar la solicitud solicitada.
            </p>

            <div className="mt-6">
              <Link
                to="/solicitudes"
                className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Volver a solicitudes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Detalle de Solicitud
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Información general y documentos asociados a la solicitud.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/solicitudes"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Volver a solicitudes
              </Link>

              <Link
                to="/dashboard"
                className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Ir al dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Datos de la solicitud
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-700">Nombre</p>
                <p className="mt-1 text-sm text-slate-600">{solicitud.nombre}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Carnet</p>
                <p className="mt-1 text-sm text-slate-600">{solicitud.carnet}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Carrera</p>
                <p className="mt-1 text-sm text-slate-600">{solicitud.carrera}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">Estado</p>
                <p className="mt-1">
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                    {solicitud.estado}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Curso aprobado
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {solicitud.cursoAprobado} ({solicitud.codigoCursoAprobado})
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Curso a equivaler
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {solicitud.cursoEquivalencia} ({solicitud.codigoCursoEquivalencia})
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Fecha de solicitud
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {solicitud.fechaSolicitud
                    ? formatearFecha(solicitud.fechaSolicitud)
                    : "Sin fecha"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Cantidad de archivos
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {solicitud.cantidadArchivos || 0}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm font-semibold text-slate-700">
                  Observaciones
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {solicitud.observaciones?.trim()
                    ? solicitud.observaciones
                    : "Sin observaciones"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Documentos asociados
            </h2>

            {documentos.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                Esta solicitud no tiene documentos asociados todavía.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Tipo de documento
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Formato
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Tamaño
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Fecha de carga
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentos.map((documento) => (
                      <tr key={documento.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {documento.tipoDocumentoLabel}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {documento.nombre}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {documento.tipo}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {formatearTamanio(documento.tamanio)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {documento.fechaCarga
                            ? formatearFecha(documento.fechaCarga)
                            : "Sin fecha"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                            {documento.estado}
                          </span>
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
    </div>
  );
}