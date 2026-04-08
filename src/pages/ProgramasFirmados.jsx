import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TIPOS_PERMITIDOS = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const TAMANIO_MAXIMO_MB = 5;
const TAMANIO_MAXIMO_BYTES = TAMANIO_MAXIMO_MB * 1024 * 1024;

export default function ProgramasFirmados() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreDocente: "",
    codigoCurso: "",
    nombreCurso: "",
    carrera: "",
    periodo: "",
  });

  const [archivo, setArchivo] = useState(null);
  const [errores, setErrores] = useState({});
  const [programas, setProgramas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("programasFirmados")) || [];
    setProgramas(data);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  function formatearTamanio(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function validar() {
    const nuevosErrores = {};

    if (!form.nombreDocente.trim()) {
      nuevosErrores.nombreDocente = "El nombre del docente es obligatorio";
    }

    if (!form.codigoCurso.trim()) {
      nuevosErrores.codigoCurso = "El código del curso es obligatorio";
    }

    if (!form.nombreCurso.trim()) {
      nuevosErrores.nombreCurso = "El nombre del curso es obligatorio";
    }

    if (!form.carrera.trim()) {
      nuevosErrores.carrera = "La carrera es obligatoria";
    }

    if (!form.periodo.trim()) {
      nuevosErrores.periodo = "El período es obligatorio";
    }

    if (!archivo) {
      nuevosErrores.archivo = "Debe seleccionar un archivo";
    } else {
      if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
        nuevosErrores.archivo = "El archivo debe ser PDF, PNG, JPG o JPEG";
      } else if (archivo.size > TAMANIO_MAXIMO_BYTES) {
        nuevosErrores.archivo = `El archivo no debe superar ${TAMANIO_MAXIMO_MB} MB`;
      }
    }

    return nuevosErrores;
  }

  function handleArchivoChange(e) {
    const seleccionado = e.target.files?.[0] || null;
    setArchivo(seleccionado);
    setMensaje("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    setMensaje("");

    if (Object.keys(nuevosErrores).length > 0) return;

    const nuevoPrograma = {
      id: Date.now(),
      ...form,
      archivoNombre: archivo.name,
      archivoTipo: archivo.type,
      archivoTamanio: archivo.size,
      estado: "Cargado",
      fechaRegistro: new Date().toISOString(),
    };

    const actualizados = [...programas, nuevoPrograma];
    setProgramas(actualizados);
    localStorage.setItem("programasFirmados", JSON.stringify(actualizados));

    setForm({
      nombreDocente: "",
      codigoCurso: "",
      nombreCurso: "",
      carrera: "",
      periodo: "",
    });
    setArchivo(null);
    setErrores({});
    setMensaje("Programa firmado registrado correctamente.");

    const inputFile = document.getElementById("programa-firmado-file");
    if (inputFile) {
      inputFile.value = "";
    }
  }

  function eliminarPrograma(id) {
    const actualizados = programas.filter((programa) => programa.id !== id);
    setProgramas(actualizados);
    localStorage.setItem("programasFirmados", JSON.stringify(actualizados));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Carga de Programas Firmados
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Registra y administra los programas firmados por curso y docente.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Volver al dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Nuevo programa firmado
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nombre del docente
                </label>
                <input
                  type="text"
                  name="nombreDocente"
                  value={form.nombreDocente}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del docente"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {errores.nombreDocente && (
                  <p className="mt-2 text-sm text-red-600">{errores.nombreDocente}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Código del curso
                </label>
                <input
                  type="text"
                  name="codigoCurso"
                  value={form.codigoCurso}
                  onChange={handleChange}
                  placeholder="Ingrese el código del curso"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {errores.codigoCurso && (
                  <p className="mt-2 text-sm text-red-600">{errores.codigoCurso}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nombre del curso
                </label>
                <input
                  type="text"
                  name="nombreCurso"
                  value={form.nombreCurso}
                  onChange={handleChange}
                  placeholder="Ingrese el nombre del curso"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {errores.nombreCurso && (
                  <p className="mt-2 text-sm text-red-600">{errores.nombreCurso}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Carrera
                </label>
                <input
                  type="text"
                  name="carrera"
                  value={form.carrera}
                  onChange={handleChange}
                  placeholder="Ingrese la carrera"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {errores.carrera && (
                  <p className="mt-2 text-sm text-red-600">{errores.carrera}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Período
                </label>
                <input
                  type="text"
                  name="periodo"
                  value={form.periodo}
                  onChange={handleChange}
                  placeholder="Ejemplo: Primer Semestre 2026"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {errores.periodo && (
                  <p className="mt-2 text-sm text-red-600">{errores.periodo}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Archivo firmado
                </label>
                <input
                  id="programa-firmado-file"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleArchivoChange}
                  className="block w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <p className="mt-2 text-sm text-slate-500">
                  Formatos permitidos: PDF, PNG, JPG, JPEG. Tamaño máximo: 5 MB.
                </p>
                {archivo && (
                  <p className="mt-2 text-sm text-slate-600">
                    Archivo seleccionado: {archivo.name}
                  </p>
                )}
                {errores.archivo && (
                  <p className="mt-2 text-sm text-red-600">{errores.archivo}</p>
                )}
              </div>

              {mensaje && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {mensaje}
                </div>
              )}

              <div className="flex justify-end gap-3">
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
                  Guardar programa
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Programas firmados registrados
            </h2>

            {programas.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                No hay programas firmados registrados todavía.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Docente
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Curso
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Código
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Archivo
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Tamaño
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
                    {programas.map((programa) => (
                      <tr key={programa.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {programa.nombreDocente}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {programa.nombreCurso}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {programa.codigoCurso}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {programa.archivoNombre}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {formatearTamanio(programa.archivoTamanio)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                            {programa.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            type="button"
                            onClick={() => eliminarPrograma(programa.id)}
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
    </div>
  );
}