import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function DocumentosCargados() {
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("archivosSolicitud")) || [];
    setDocumentos(data);
  }, []);

  function formatearTamanio(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleString();
  }

  function eliminarDocumento(id) {
    const actualizados = documentos.filter((documento) => documento.id !== id);
    setDocumentos(actualizados);
    localStorage.setItem("archivosSolicitud", JSON.stringify(actualizados));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Documentos Cargados
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Visualiza los documentos cargados para las solicitudes de equivalencia.
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
                to="/carga-archivos"
                className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Cargar más archivos
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          {documentos.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
              No hay documentos cargados todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                    <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                      Acción
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
                        {formatearFecha(documento.fechaCarga)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                          {documento.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          type="button"
                          onClick={() => eliminarDocumento(documento.id)}
                          className="rounded-xl border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Eliminar
                        </button>
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