import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http.js";
import { useErrorSnackbar } from "../contexts/error/ErrorSnackbarProvider.jsx";

const SEMESTRES = ["Primer Semestre", "Segundo Semestre"];
const YEAR = new Date().getFullYear();
const YEARS = [
    2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
    2024, 2025, 2026,
];
const CAREERS = [
    {
        code: "SIS",
        name: "Ingeniería en Ciencias y Sistemas",
    },
    {
        code: "CIV",
        name: "Ingeniería Civil",
    },
    {
        code: "IND",
        name: "Ingeniería Industrial",
    },
    {
        code: "MEC",
        name: "Ingeniería Mecánica",
    },
    {
        code: "MEC_IND",
        name: "Ingeniería Mecánica Industrial",
    },
];

const initialForm = {
    nombreDocente: "",
    codigoCurso: "",
    nombreCurso: "",
    carrera: "",
    semestre: "",
    seccion: "",
};

export default function DocenteCursos() {
    const navigate = useNavigate();
    const { showError } = useErrorSnackbar();

    const [form, setForm] = useState(initialForm);
    const [errores, setErrores] = useState({});
    const [busy, setBusy] = useState(false);

    const [asignaciones, setAsignaciones] = useState([]);
    const [loadingAsig, setLoadingAsig] = useState(false);

    const [cursos, setCursos] = useState([]);
    const [loadingCursos, setLoadingCursos] = useState(false);

    const [selectedSemLabel, setSelectedSemLabel] = useState("");
    const [selectedYear, setSelectedYear] = useState(String(YEAR));

    useEffect(() => {
        void fetchAsignaciones();
        void fetchCursos();
    }, []);

    const fetchAsignaciones = async () => {
        setLoadingAsig(true);
        try {
            const res = await http("/docenteCursos", { method: "GET" });
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

    const buildSemestre = () => {
        if (!selectedSemLabel || !selectedYear) return "";
        return `${selectedSemLabel} ${selectedYear}`;
    };

    const validar = () => {
        const e = {};
        if (!form.nombreDocente.trim()) e.nombreDocente = "Requerido";
        else if (form.nombreDocente.trim().length < 5)
            e.nombreDocente = "Mínimo 5 caracteres";
        if (!form.codigoCurso) e.codigoCurso = "Selecciona un curso";
        if (!form.carrera.trim()) e.carrera = "Requerido";
        if (!selectedSemLabel) e.semestre = "Selecciona semestre";
        if (!selectedYear) e.year = "Selecciona año";
        if (!form.seccion.trim()) e.seccion = "Requerido";
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
                ...form,
                semestre: buildSemestre(),
            };
            const res = await http("/docenteCursos", {
                method: "POST",
                body: payload,
            });
            if (res.status === 201 || res.status === 200) {
                setForm(initialForm);
                setSelectedSemLabel("");
                setSelectedYear(String(YEAR));
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

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-2xl font-bold text-slate-900">
                        Cursos por Docente
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                        Asigna cursos impartidos a cada docente
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
                        {/* Nombre del docente */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Nombre del docente
                            </label>
                            <input
                                type="text"
                                value={form.nombreDocente}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        nombreDocente: e.target.value,
                                    }))
                                }
                                placeholder="Ej: Juan Pérez"
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                            />
                            {errores.nombreDocente && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errores.nombreDocente}
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

                        {/* Carrera */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Carrera
                            </label>

                            <select
                                value={form.carrera}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        carrera: e.target.value,
                                    }))
                                }
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                            >
                                <option value="">Selecciona una carrera</option>

                                {CAREERS.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            {errores.carrera && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errores.carrera}
                                </p>
                            )}
                        </div>

                        {/* Semestre + Año */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Semestre
                                </label>
                                <select
                                    value={selectedSemLabel}
                                    onChange={(e) =>
                                        setSelectedSemLabel(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                                >
                                    <option value="">Selecciona</option>
                                    {SEMESTRES.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                {errores.semestre && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errores.semestre}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Año
                                </label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) =>
                                        setSelectedYear(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                                >
                                    {YEARS.map((y) => (
                                        <option key={y} value={String(y)}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                                {errores.year && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {errores.year}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sección */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Sección
                            </label>
                            <input
                                type="text"
                                value={form.seccion}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        seccion: e.target.value,
                                    }))
                                }
                                placeholder="Ej: A"
                                maxLength={5}
                                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
                            />
                            {errores.seccion && (
                                <p className="text-xs text-red-600 mt-1">
                                    {errores.seccion}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setForm(initialForm);
                                    setErrores({});
                                    setSelectedSemLabel("");
                                    setSelectedYear(String(YEAR));
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
                            Asignaciones registradas
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
                            No hay asignaciones registradas.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Docente
                                        </th>
                                        <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Curso
                                        </th>
                                        <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Semestre
                                        </th>
                                        <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                            Sección
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {asignaciones.map((a, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-slate-100 hover:bg-slate-50"
                                        >
                                            <td className="px-3 py-2.5 text-slate-800">
                                                {a.nombreprofesor ??
                                                    a.nombreProfesor}
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded mr-1">
                                                    {a.codigocurso ??
                                                        a.codigoCurso}
                                                </span>
                                                {a.nombrecurso ?? a.nombreCurso}
                                            </td>
                                            <td className="px-3 py-2.5 text-slate-600">
                                                {a.semestre}
                                            </td>
                                            <td className="px-3 py-2.5 text-slate-600">
                                                {a.seccion}
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
