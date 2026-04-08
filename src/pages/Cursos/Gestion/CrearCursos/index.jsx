import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../../../api/http.js";
import { useErrorSnackbar } from "../../../../contexts/error/ErrorSnackbarProvider.jsx";
import { useAuth } from "../../../../contexts/auth/AuthContext.jsx";

const CrearCursos = () => {
    const navigate = useNavigate();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [options, setOptions] = useState(null);
    const { showError } = useErrorSnackbar();
    const { token } = useAuth();

    useEffect(() => {
        void getOptions();
    }, []);

    const getOptions = async () => {
        setBusy(true);
        try {
            const response = await http("/cursos/options", { method: "GET" });
            if (response.status === 200) {
                console.log("OPTIONS RESPONSE:", response.data);

                setOptions(response.data);
            } else {
                showError(response?.statusText);
            }
        } catch (error) {
            console.error(
                "Error al obtener los datos requeridos para crear un curso: ",
                error
            );
            showError(error?.message ?? "Error desconocido");
        } finally {
            setBusy(false);
        }
    };

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setBusy(true);

        const form = new FormData(e.currentTarget);

        try {
            const payload = {
                nombre: String(form.get("nombre") ?? "").trim(),
                codigo: String(form.get("codigo") ?? "").trim(),
                descripcion: String(form.get("descripcion") ?? "").trim(),
                pensum: String(form.get("pensum") ?? ""),
                creditos: parseInt(String(form.get("creditos")), 10),
                horasTeoricas: parseInt(String(form.get("horasTeoricas")), 10),
                horasPracticas: parseInt(
                    String(form.get("horasPracticas")),
                    10
                ),
            };

            if (
                !payload.nombre ||
                !payload.codigo ||
                !payload.descripcion ||
                !payload.pensum
            ) {
                throw new Error("Completa todos los campos requeridos.");
            }
            for (const k of ["creditos", "horasTeoricas", "horasPracticas"]) {
                if (!Number.isFinite(payload[k]) || payload[k] <= 0) {
                    throw new Error(
                        "Los campos numéricos deben ser enteros mayores a 0."
                    );
                }
            }

            const res = await http("/cursos/crear", {
                method: "POST",
                body: payload,
            });

            if (res?.status !== 200 && res?.status !== 201) {
                throw new Error(res?.statusText || "No se pudo crear el curso");
            }

            navigate("/cursos");
        } catch (error) {
            const msg = error?.message ?? "Error desconocido";
            setError(msg);
            showError(msg);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between my-2 mx-4">
                <h4 className="text-2xl font-bold text-slate-900">
                    Crear Curso
                </h4>
                <div className="min-w-[150px]">
                    <button
                        type="button"
                        onClick={() => navigate("/cursos")}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-300"
                    >
                        Volver
                    </button>
                </div>
            </div>

            <hr className="my-2 border-t border-gray-200" />

            <div className="mx-4 my-4">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Nombre
                                </label>
                                <input
                                    name="nombre"
                                    type="text"
                                    required
                                    placeholder="Nombre del curso"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Código
                                </label>
                                <input
                                    name="codigo"
                                    type="text"
                                    required
                                    placeholder="Código"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    name="descripcion"
                                    required
                                    placeholder="Descripción"
                                    rows={3}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Pensum
                                </label>
                                <select
                                    name="pensum"
                                    required
                                    defaultValue=""
                                    disabled={busy && !options}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 disabled:opacity-60"
                                >
                                    <option value="" disabled>
                                        Selecciona un pensum
                                    </option>
                                    {(options?.pensums ?? []).map((p) => {
                                        const value = p?.id ?? p?.value ?? p;
                                        const label =
                                            p?.nombre ??
                                            p?.label ??
                                            String(value);
                                        return (
                                            <option
                                                key={String(value)}
                                                value={value}
                                            >
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Créditos
                                </label>
                                <input
                                    name="creditos"
                                    type="number"
                                    required
                                    min={1}
                                    step={1}
                                    inputMode="numeric"
                                    placeholder="Ej: 3"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Horas teóricas
                                </label>
                                <input
                                    name="horasTeoricas"
                                    type="number"
                                    required
                                    min={1}
                                    step={1}
                                    inputMode="numeric"
                                    placeholder="Ej: 2"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Horas prácticas
                                </label>
                                <input
                                    name="horasPracticas"
                                    type="number"
                                    required
                                    min={1}
                                    step={1}
                                    inputMode="numeric"
                                    placeholder="Ej: 2"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={busy}
                            className="w-full bg-brand-600 text-white font-semibold py-3 rounded-xl hover:bg-brand-700 transition disabled:opacity-60"
                        >
                            {busy ? "Guardando..." : "Guardar curso"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CrearCursos;
