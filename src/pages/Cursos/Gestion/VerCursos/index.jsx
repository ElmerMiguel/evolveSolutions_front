import React, { useEffect, useState } from "react";
import useValidarPermiso from "../../../../hooks/useValidarPermiso.js";
import { useErrorSnackbar } from "../../../../contexts/error/ErrorSnackbarProvider.jsx";
import { http } from "../../../../api/http.js";
import { PERMISOS_CURSOS } from "../../../../entities/permisos/cursos.js";
import { TIPOS_AUTORIZACIONES } from "../../../../entities/enums/TiposAutorizacion.js";
import { useNavigate } from "react-router-dom";

const { CURSOS } = PERMISOS_CURSOS;
const { ESCRITURA } = TIPOS_AUTORIZACIONES;

const VerCursos = () => {
    const { validarPermiso } = useValidarPermiso();
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(false);
    const { showError } = useErrorSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        void getCursos();
    }, []);

    useEffect(() => {
        console.log(cursos);
    }, [cursos]);

    const getCursos = async () => {
        setLoading(true);
        try {
            const response = await http("/cursos", { method: "GET" });
            if (response.status === 200) {
                setCursos(response.data);
            } else {
                showError(response?.statusText);
            }
        } catch (error) {
            console.error("Error al obtener los cursos: ", error);
            showError(error?.message ?? "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between my-2 mx-4">
                <h4 className="text-2xl font-bold text-slate-900">Cursos</h4>

                {validarPermiso(CURSOS, ESCRITURA) && (
                    <div className="min-w-[150px]">
                        <button
                            type="button"
                            onClick={() => navigate("/cursos/crear")}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-300"
                        >
                            Crear Curso
                        </button>
                    </div>
                )}
            </div>

            <hr className="my-2 border-t border-gray-200" />

            {loading ? (
                <p className="text-gray-500">Cargando cursos...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border bg-brand-100 px-4 py-2 text-left">
                                    ID
                                </th>
                                <th className="border bg-brand-100 px-4 py-2 text-left">
                                    Nombre
                                </th>
                                <th className="border bg-brand-100 px-4 py-2 text-left">
                                    Descripción
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cursos.map((curso) => (
                                <tr key={curso.id} className="hover:bg-gray-50">
                                    <td className="border bg-brand-50 px-4 py-2">
                                        {curso.code}
                                    </td>
                                    <td className="border bg-brand-50 px-4 py-2">
                                        {curso.name}
                                    </td>
                                    <td className="border bg-brand-50 px-4 py-2">
                                        {curso.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VerCursos;
