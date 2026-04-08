import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TIPOS_PERMITIDOS = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const TAMANIO_MAXIMO_MB = 5;
const TAMANIO_MAXIMO_BYTES = TAMANIO_MAXIMO_MB * 1024 * 1024;

const TIPOS_DOCUMENTO = [
  { value: "", label: "Seleccione un tipo de documento" },
  { value: "certificacion_cursos", label: "Certificación de cursos aprobados" },
  { value: "programa_cursos", label: "Programa de cursos" },
  { value: "identificacion", label: "Documento de identificación" },
  { value: "constancia_pago", label: "Constancia de pago" },
  { value: "carta_solicitud", label: "Carta de solicitud" },
  { value: "otro", label: "Otro documento" },
];

export default function CargaArchivos() {
  const navigate = useNavigate();

  const [tipoDocumento, setTipoDocumento] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [errores, setErrores] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const solicitudActivaId = localStorage.getItem("solicitudActivaId");

  function obtenerLabelTipoDocumento(valor) {
    const encontrado = TIPOS_DOCUMENTO.find((tipo) => tipo.value === valor);
    return encontrado ? encontrado.label : valor;
  }

  function manejarSeleccionArchivos(e) {
    const seleccionados = Array.from(e.target.files || []);
    const nuevosErrores = [];
    const archivosValidos = [];

    if (!solicitudActivaId) {
      setErrores(["No hay una solicitud activa. Primero debe registrar una solicitud."]);
      e.target.value = "";
      return;
    }

    if (!tipoDocumento) {
      setErrores(["Debe seleccionar un tipo de documento antes de cargar archivos."]);
      e.target.value = "";
      return;
    }

    const yaExisteTipo = archivos.some(
      (archivo) => archivo.tipoDocumento === tipoDocumento
    );

    if (yaExisteTipo) {
      setErrores(["Ya cargó un archivo para ese tipo de documento en esta solicitud."]);
      e.target.value = "";
      return;
    }

    if (seleccionados.length > 1) {
      setErrores(["Solo puede cargar un archivo por cada tipo de documento."]);
      e.target.value = "";
      return;
    }

    seleccionados.forEach((archivo) => {
      if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
        nuevosErrores.push(
          `El archivo "${archivo.name}" no tiene un formato permitido.`
        );
        return;
      }

      if (archivo.size > TAMANIO_MAXIMO_BYTES) {
        nuevosErrores.push(
          `El archivo "${archivo.name}" supera el límite de ${TAMANIO_MAXIMO_MB} MB.`
        );
        return;
      }

      archivosValidos.push({
        id: Date.now() + Math.random(),
        solicitudId: Number(solicitudActivaId),
        nombre: archivo.name,
        tipo: archivo.type,
        tamanio: archivo.size,
        tipoDocumento,
        tipoDocumentoLabel: obtenerLabelTipoDocumento(tipoDocumento),
      });
    });

    setErrores(nuevosErrores);
    setMensaje("");

    if (archivosValidos.length > 0) {
      setArchivos((prev) => [...prev, ...archivosValidos]);
      setTipoDocumento("");
    }

    e.target.value = "";
  }

  function eliminarArchivo(id) {
    setArchivos((prev) => prev.filter((archivo) => archivo.id !== id));
    setMensaje("");
  }

  function formatearTamanio(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function guardarArchivos() {
    if (!solicitudActivaId) {
      setErrores(["No hay una solicitud activa."]);
      setMensaje("");
      return;
    }

    if (archivos.length === 0) {
      setErrores(["Debe cargar al menos un archivo."]);
      setMensaje("");
      return;
    }

    const archivosGuardados =
      JSON.parse(localStorage.getItem("archivosSolicitud")) || [];

    const nuevosRegistros = archivos.map((archivo) => ({
      ...archivo,
      fechaCarga: new Date().toISOString(),
      estado: "Cargado",
    }));

    const todosLosArchivos = [...archivosGuardados, ...nuevosRegistros];

    localStorage.setItem(
      "archivosSolicitud",
      JSON.stringify(todosLosArchivos)
    );

    const solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
    const solicitudesActualizadas = solicitudes.map((solicitud) => {
      if (solicitud.id === Number(solicitudActivaId)) {
        return {
          ...solicitud,
          cantidadArchivos: todosLosArchivos.filter(
            (archivo) => archivo.solicitudId === solicitud.id
          ).length,
        };
      }
      return solicitud;
    });

    localStorage.setItem("solicitudes", JSON.stringify(solicitudesActualizadas));
    localStorage.removeItem("solicitudActivaId");

    setMensaje("Los archivos fueron cargados correctamente.");
    setErrores([]);
    setArchivos([]);
    setTipoDocumento("");

    navigate("/solicitudes");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Carga de Archivos
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Adjunte los documentos requeridos para la solicitud de equivalencia.
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg space-y-6">
          {!solicitudActivaId && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              No hay una solicitud activa. Registre primero una solicitud antes de cargar archivos.
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tipo de documento
              </label>
              <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                disabled={!solicitudActivaId}
              >
                {TIPOS_DOCUMENTO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Seleccionar archivo
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={manejarSeleccionArchivos}
                disabled={!solicitudActivaId}
                className="block w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Formatos permitidos: PDF, PNG, JPG, JPEG. Tamaño máximo: 5 MB por archivo.
          </p>

          {errores.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
              <ul className="space-y-1 text-sm text-red-600">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {mensaje && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {mensaje}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Documentos cargados para esta solicitud
            </h2>

            {archivos.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                No hay documentos cargados.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
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
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {archivos.map((archivo) => (
                      <tr key={archivo.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {archivo.tipoDocumentoLabel}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {archivo.nombre}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {archivo.tipo}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {formatearTamanio(archivo.tamanio)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            type="button"
                            onClick={() => eliminarArchivo(archivo.id)}
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

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={guardarArchivos}
              disabled={!solicitudActivaId}
              className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Guardar archivos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}