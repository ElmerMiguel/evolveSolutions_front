import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import Loadable from "../../components/Loadable";

const CursosDocente = Loadable(lazy(() => import("../../pages/Docente/CursosDocente")));
const DocumentosCargados = Loadable(lazy(() => import("../../pages/Docente/DocumentosCargados")));

export default function GestionDocenteRoutes() {
  return useRoutes([
    {
      path: "cursos",
      element: <CursosDocente />,
    },
    {
      path: "documentos",
      element: <DocumentosCargados />,
    },
  ]);
}