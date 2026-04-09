import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CursosDocente() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreDocente: "",
    codigoCurso: "",
    nombreCurso: "",
    carrera: "",
    semestre: "",
    seccion: "",
  });

  const [errores, setErrores] = useState({});
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("docenteCursos")) || [];
    setCursos(data);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  function validar() {
    const nuevosErrores = {};

    if (!form.nombreDocente.trim()) {
      nuevosErrores.nombreDocente = "El nombre del docente es obligatorio";
    } else if (form.nombreDocente.trim().length < 5) {
      nuevosErrores.nombreDocente = "El nombre debe tener al menos 5 caracteres";
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

    if (!form.semestre.trim()) {
      nuevosErrores.semestre = "El semestre es obligatorio";
    }

    if (!form.seccion.trim()) {
      nuevosErrores.seccion = "La sección es obligatoria";
    }

    return nuevosErrores;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const nuevosErrores = validar();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    const nuevoCurso = {
      id: Date.now(),
      ...form,
      fechaRegistro: new Date().toISOString(),
    };

    const actualizados = [...cursos, nuevoCurso];
    setCursos(actualizados);
    localStorage.setItem("docenteCursos", JSON.stringify(actualizados));

    setForm({
      nombreDocente: "",
      codigoCurso: "",
      nombreCurso: "",
      carrera: "",
      semestre: "",
      seccion: "",
    });

    setErrores({});
  }

  function eliminarCurso(id) {
    const actualizados = cursos.filter((curso) => curso.id !== id);
    setCursos(actualizados);
    localStorage.setItem("docenteCursos", JSON.stringify(actualizados));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Registro de Cursos del Docente
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Registra los cursos que imparte cada docente dentro del sistema.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/dashboard"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Volver al dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Nuevo curso impartido
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
                  Semestre
                </label>
                <input
                  type="text"
                  name="semestre"
                  value={form.semestre}
                  onChange={handleChange}
                  placeholder="Ejemplo: Primer Semestre 2026"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {errores.semestre && (
                  <p className="mt-2 text-sm text-red-600">{errores.semestre}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Sección
                </label>
                <input
                  type="text"
                  name="seccion"
                  value={form.seccion}
                  onChange={handleChange}
                  placeholder="Ingrese la sección"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                {errores.seccion && (
                  <p className="mt-2 text-sm text-red-600">{errores.seccion}</p>
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
                  type="submit"
                  className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
                >
                  Guardar curso
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Cursos registrados
            </h2>

            {cursos.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                No hay cursos registrados todavía.
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
                        Código
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Curso
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Carrera
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Semestre
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Sección
                      </th>
                      <th className="px-4 py-3 text-sm font-semibold text-slate-800">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.map((curso) => (
                      <tr key={curso.id} className="border-b border-slate-100">
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {curso.nombreDocente}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {curso.codigoCurso}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {curso.nombreCurso}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {curso.carrera}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {curso.semestre}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">
                          {curso.seccion}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            type="button"
                            onClick={() => eliminarCurso(curso.id)}
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