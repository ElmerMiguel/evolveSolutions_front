import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TIPOS_PERMITIDOS = ["application/pdf"];
const TAMANIO_MAXIMO_MB = 5;
const TAMANIO_MAXIMO_BYTES = TAMANIO_MAXIMO_MB * 1024 * 1024;

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_URL;

const UploadProgram = () => {
  const navigate = useNavigate();

  const [teacherCourses, setTeacherCourses]           = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [archivo, setArchivo]         = useState(null);
  const [errores, setErrores]         = useState({});
  const [programas, setProgramas]     = useState([]);
  const [mensaje, setMensaje]         = useState("");
  const [cargandoCursos, setCargandoCursos] = useState(true);

  // Cargar cursos desde la API
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch(`${API_URL}/programas/teacher-courses`, {
          credentials: "include", // ← la cookie authToken viaja automáticamente
        });
        if (!res.ok) throw new Error("Error al obtener cursos");
        const data = await res.json();
        setTeacherCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setCargandoCursos(false);
      }
    };
    fetchCursos();
  }, []);

  // Cargar programas guardados localmente
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("programasFirmados")) || [];
    setProgramas(data);
  }, []);

  function formatearTamanio(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function validar() {
    const nuevosErrores = {};

    if (!cursoSeleccionado)
      nuevosErrores.curso = "Debes seleccionar un curso";

    if (!archivo) {
      nuevosErrores.archivo = "Debe seleccionar un archivo";
    } else {
      if (!TIPOS_PERMITIDOS.includes(archivo.type))
        nuevosErrores.archivo = "El archivo debe ser PDF, PNG, JPG o JPEG";
      else if (archivo.size > TAMANIO_MAXIMO_BYTES)
        nuevosErrores.archivo = `El archivo no debe superar ${TAMANIO_MAXIMO_MB} MB`;
    }

    return nuevosErrores;
  }

  function handleArchivoChange(e) {
    const seleccionado = e.target.files?.[0] || null;
    setArchivo(seleccionado);
    setMensaje("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
  
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    setMensaje("");
  
    if (Object.keys(nuevosErrores).length > 0) return;
  
    const curso = teacherCourses.find(
      (c) => String(c.id) === String(cursoSeleccionado)
    );
  
    if (!curso) {
      setMensaje("Curso no válido");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("file", archivo);
      formData.append("teacher_course_id", curso.id);
  
      const res = await fetch(`${API_URL}/programas/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Error al subir programa");
      }
  
      const nuevoPrograma = {
        id: Date.now(),
        teacherCourseId: curso.id,
        codigoCurso: curso.code,
        nombreCurso: curso.name,
        archivoNombre: archivo.name,
        archivoTipo: archivo.type,
        archivoTamanio: archivo.size,
        estado: "Subido",
        fechaRegistro: new Date().toISOString(),
      };
  
      const actualizados = [...programas, nuevoPrograma];
      setProgramas(actualizados);
      localStorage.setItem("programasFirmados", JSON.stringify(actualizados));
  
      setCursoSeleccionado("");
      setArchivo(null);
      setErrores({});
      setMensaje("Programa subido correctamente");
  
      const inputFile = document.getElementById("programa-firmado-file");
      if (inputFile) inputFile.value = "";
  
    } catch (err) {
      console.error(err);
      setMensaje(err.message || "Error al subir programa");
    }
  }

  function eliminarPrograma(id) {
    const actualizados = programas.filter((p) => p.id !== id);
    setProgramas(actualizados);
    localStorage.setItem("programasFirmados", JSON.stringify(actualizados));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
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

          {/* Formulario */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Nuevo programa firmado
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">

              {/* Selector de curso */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Curso
                </label>
                {cargandoCursos ? (
                  <p className="text-sm text-slate-400">Cargando cursos...</p>
                ) : (
                  <select
                    value={cursoSeleccionado}
                    onChange={(e) => {
                      setCursoSeleccionado(e.target.value);
                      setMensaje("");
                    }}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="">— Selecciona un curso —</option>
                    {teacherCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.name} ({c.year_teaching} - {c.semester})
                      </option>
                    ))}
                  </select>
                )}
                {errores.curso && (
                  <p className="mt-2 text-sm text-red-600">{errores.curso}</p>
                )}
              </div>

              {/* Detalle del curso seleccionado */}
              {cursoSeleccionado && (() => {
                const c = teacherCourses.find((c) => c.id === cursoSeleccionado);
                return c ? (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600 space-y-1">
                    <p><span className="font-semibold text-slate-700">Código:</span> {c.code}</p>
                    <p><span className="font-semibold text-slate-700">Créditos:</span> {c.credits}</p>
                    {c.description && (
                      <p><span className="font-semibold text-slate-700">Descripción:</span> {c.description}</p>
                    )}
                  </div>
                ) : null;
              })()}

              {/* Upload de archivo */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Archivo firmado
                </label>
                <input
                  id="programa-firmado-file"
                  type="file"
                  accept=".pdf"
                  onChange={handleArchivoChange}
                  className="block w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <p className="mt-2 text-sm text-slate-500">
                  Formatos permitidos: PDF Tamaño máximo: 5 MB.
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

              {/* Mensaje éxito */}
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

          {/* Tabla de registros */}
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
                      {["Curso", "Código", "Archivo", "Tamaño", "Estado", "Acción"].map((col) => (
                        <th key={col} className="px-4 py-3 text-sm font-semibold text-slate-800">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {programas.map((programa) => (
                      <tr key={programa.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-sm text-slate-700">{programa.nombreCurso}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{programa.codigoCurso}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{programa.archivoNombre}</td>
                        <td className="px-4 py-3 text-sm text-slate-700">{formatearTamanio(programa.archivoTamanio)}</td>
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
};

export default UploadProgram;