import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http.js";
import { useErrorSnackbar } from "../contexts/error/ErrorSnackbarProvider.jsx";

const initialForm = {
    carnet: "",
    codigoCurso: "",
    nombreCurso: "",
    nota: "",
};

export default function EstudianteCursos() {
    const navigate = useNavigate();
    const { showError } = useErrorSnackbar();

    const [form, setForm] = useState(initialForm);
    const [errores, setErrores] = useState({});
    const [busy, setBusy] = useState(false);

    const [asignaciones, setAsignaciones] = useState([]);
    const [loadingAsig, setLoadingAsig] = useState(false);

    const [cursos, setCursos] = useState([]);
    const [loadingCursos, setLoadingCursos] = useState(false);

    useEffect(() => {
        void fetchAsignaciones();
        void fetchCursos();
    }, []);

    const fetchAsignaciones = async () => {
        setLoadingAsig(true);
        try {
            const res = await http("/estudianteCursos", { method: "GET" });
            setAsignaciones(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            showError(e?.message ?? "Error al cargar asignaciones");
        } finally {
            setLoadingAsig(false);
        }
    };

    const fetchCursos = async () => {
        setLoadingCursos(true);
        try {
            const res = await http("/cursos", { method: "GET" });
            setCursos(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            showError(e?.message ?? "Error al cargar cursos");
        } finally {
            setLoadingCursos(false);
        }
    };

    const handleCursoChange = (e) => {
        const selected = cursos.find((c) => c.code === e.target.value);
        if (selected) {
            setForm((f) => ({
                ...f,
                codigoCurso: selected.code,
                nombreCurso: selected.name,
            }));
        } else {
            setForm((f) => ({ ...f, codigoCurso: "", nombreCurso: "" }));
        }
    };

    const validar = () => {
        const e = {};
        if (!form.carnet.trim()) e.carnet = "Requerido";
        if (!form.codigoCurso) e.codigoCurso = "Selecciona un curso";
        if (form.nota !== "" && isNaN(Number(form.nota))) {
            e.nota = "La nota debe ser numérica";
        }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validar();
        setErrores(errs);
        if (Object.keys(errs).length > 0) return;

        setBusy(true);
        try {
            const payload = {
                carnet: form.carnet.trim(),
                codigoCurso: form.codigoCurso,
                // Si la nota está vacía, enviamos null o la omitimos para que el backend maneje el default
                nota: form.nota === "" ? null : Number(form.nota),
            };
            const res = await http("/estudianteCursos", {
                method: "POST",
                body: payload,
            });
            if (res.status === 201 || res.status === 200) {
                setForm(initialForm);
                setErrores({});
                void fetchAsignaciones();
            } else {
                showError(res.data?.error ?? "Error al crear asignación");
            }
        } catch (err) {
            showError(err?.message ?? "Error desconocido");
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta asignación?"))
            return;

        try {
            const res = await http(`/estudianteCursos/${id}`, {
                method: "DELETE",
            });
            if (res.status === 200) {
                void fetchAsignaciones();
            } else {
                showError(res.data?.error ?? "Error al eliminar asignación");
            }
        } catch (err) {
            showError(err?.message ?? "Error al comunicarse con el servidor");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-2xl font-bold text-slate-900">
                        Cursos por Estudiante
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                        Asigna cursos ganados y sus notas a los estudiantes
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 rounded-md border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
                >
                    Volver al dashboard
                </button>
            </div>

            <hr className="border-t border-gray-200" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ── Formulario ── */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-5">
                        Nueva asignación
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Carnet del estudiante */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Carnet del Estudiante
                            </label>
                            <input
                                type="text"
                                value={form.carnet}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        carnet: e.target.value,
                                    }))
                                }
                                placeholder="Ej: 202012345"
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                            />
                            {errores.carnet && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errores.carnet}
                                </p>
                            )}
                        </div>

                        {/* Selector de curso */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Curso
                            </label>
                            <select
                                value={form.codigoCurso}
                                onChange={handleCursoChange}
                                disabled={loadingCursos}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-60"
                            >
                                <option value="">
                                    {loadingCursos
                                        ? "Cargando cursos..."
                                        : "Selecciona un curso"}
                                </option>
                                {cursos.map((c) => (
                                    <option key={c.id} value={c.code}>
                                        {c.code} — {c.name}
                                    </option>
                                ))}
                            </select>
                            {errores.codigoCurso && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errores.codigoCurso}
                                </p>
                            )}
                        </div>

                        {/* Código y nombre auto-rellenados (solo lectura) */}
                        {form.codigoCurso && (
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">
                                        Código
                                    </label>
                                    <input
                                        readOnly
                                        value={form.codigoCurso}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1">
                                        Nombre del curso
                                    </label>
                                    <input
                                        readOnly
                                        value={form.nombreCurso}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Nota (Opcional) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Nota Obtenida (Opcional)
                            </label>
                            <input
                                type="number"
                                value={form.nota}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        nota: e.target.value,
                                    }))
                                }
                                placeholder="Ej: 85"
                                min="0"
                                max="100"
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                            />
                            {errores.nota && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errores.nota}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setForm(initialForm);
                                    setErrores({});
                                }}
                                className="px-4 py-2 rounded-xl border border-slate-300 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                Limpiar
                            </button>
                            <button
                                type="submit"
                                disabled={busy}
                                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 disabled:opacity-60"
                            >
                                {busy ? "Guardando..." : "Guardar asignación"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Listado ── */}
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Cursos Ganados
                        </h2>
                        <button
                            type="button"
                            onClick={fetchAsignaciones}
                            disabled={loadingAsig}
                            className="text-xs text-sky-600 hover:underline disabled:opacity-50"
                        >
                            {loadingAsig ? "Cargando..." : "Actualizar"}
                        </button>
                    </div>

                    {loadingAsig ? (
                        <p className="text-sm text-slate-500 text-center py-8">
                            Cargando asignaciones...
                        </p>
                    ) : asignaciones.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
                            No hay cursos ganados registrados.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Carnet
                                        </th>
                                        <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Curso
                                        </th>
                                        <th className="text-center px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Nota
                                        </th>
                                        <th className="text-center px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asignaciones.map((a, i) => (
                                        <tr
                                            key={a.id || i}
                                            className="border-b border-slate-100 hover:bg-slate-50"
                                        >
                                            <td className="px-3 py-2.5 text-slate-800 font-medium">
                                                {a.carnet ?? a.student_code}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded mr-1">
                                                    {a.codigocurso ??
                                                        a.codigoCurso ??
                                                        a.course_code}
                                                </span>
                                                {a.nombrecurso ??
                                                    a.nombreCurso ??
                                                    a.course_name}
                                            </td>
                                            <td className="px-3 py-2.5 text-slate-600 text-center">
                                                {a.nota ?? a.grade ?? "-"}
                                            </td>
                                            <td className="px-3 py-2.5 text-center">
                                                {a.id && (
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(a.id)
                                                        }
                                                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                    >
                                                        Eliminar
                                                    </button>
                                                )}
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
