import React from "react";
import Login from "../pages/auth/Login.jsx";
import { Book } from "lucide-react";
import cursosRoutes from "./Cursos/index.jsx";
import SolicitudEquivalencia from "../pages/SolicitudEquivalencia.jsx";
import Solicitudes from "../pages/Solicitudes.jsx";
import CargaArchivos from "../pages/CargaArchivos.jsx";
import DocumentosCargados from "../pages/DocumentosCargados.jsx";
import EstudianteCursos from "../pages/EstudianteCursos.jsx";
import ProgramasFirmados from "../pages/ProgramasFirmados.jsx";
import DocenteCursos from "../pages/DocenteCursos.jsx";

const UseHandleRoutes = () => {
    return [
        {
            name: "Login",
            key: "Login",
            route: "/login",
            component: <Login />,
        },
        {
            type: "collapse",
            name: "Inicio",
            key: "dashboard",
            icon: (
                <svg
                    className="w-6 h-6 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                </svg>
            ),
            route: "/dashboard",
            noCollapse: true,
        },

        {
            type: "collapse",
            name: "Cursos",
            key: "cursos",
            icon: <Book className="w-6 h-6 text-blue-500" />,
            collapse: cursosRoutes,
        },

        {
            name: "Solicitud Equivalencia",
            key: "solicitud-equivalencia",
            route: "/solicitud-equivalencia",
            component: <SolicitudEquivalencia />,
        },
        {
            name: "Solicitudes",
            key: "solicitudes",
            route: "/solicitudes",
            component: <Solicitudes />,
        },
        {
            name: "Carga Archivos",
            key: "carga-archivos",
            route: "/carga-archivos",
            component: <CargaArchivos />,
        },
        {
            name: "Documentos Cargados",
            key: "documentos-cargados",
            route: "/documentos-cargados",
            component: <DocumentosCargados />,
        },
        {
            name: "Docente Cursos",
            key: "docente-cursos",
            route: "/docente-cursos",
            component: <DocenteCursos />,
        },
        {
            name: "Estudiante Cursos",
            key: "estudiante-cursos",
            route: "/estudiante-cursos",
            component: <EstudianteCursos />,
        },
        {
            name: "Programas Firmados",
            key: "programas-firmados",
            route: "/programas-firmados",
            component: <ProgramasFirmados />,
        },
    ];
};

export default UseHandleRoutes;
