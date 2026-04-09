import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import Loadable from "../../components/Loadable";

const NuevaSolicitud = Loadable(lazy(() => import("../../pages/Estudiante/SolicitudEquivalencia")));
const SolicitudesRegistradas = Loadable(lazy(() => import("../../pages/Estudiante/SolicitudesRegistradas")));
const CargaArchivos = Loadable(lazy(() => import("../../pages/Estudiante/CargaArchivosEquivalencia")));
const Cursos = Loadable(lazy(() => import("../../pages/Estudiante/EstudianteCursos")));


export default function GestionEstudianteRoutes() {
  return useRoutes([
    { path: "nueva-solicitud", element: <NuevaSolicitud /> },
    { path: "solicitudes", element: <SolicitudesRegistradas /> },
    { path: "carga-archivos", element: <CargaArchivos /> },
    { path: "cursos", element: <Cursos /> },
  ]);
}