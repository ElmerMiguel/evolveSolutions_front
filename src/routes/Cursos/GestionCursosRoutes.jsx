import { lazy } from "react";
import Loadable from "../../components/Loadable/index.jsx";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../../components/PrivateRoute/index.jsx";
import { PERMISOS_CURSOS } from "../../entities/permisos/cursos.js";
import { TIPOS_AUTORIZACIONES } from "../../entities/enums/TiposAutorizacion.js";

const { CURSOS } = PERMISOS_CURSOS;
const { ESCRITURA } = TIPOS_AUTORIZACIONES;

const VerCursos = Loadable(
    lazy(() => import("../../pages/Cursos/Gestion/VerCursos"))
);
const CrearCursos = Loadable(
    lazy(() => import("../../pages/Cursos/Gestion/CrearCursos"))
);

const GestionCursosRoutes = () => {
    return (
        <Routes>
            <Route index element={<VerCursos />} />
            <Route
                path="crear"
                element={
                    <PrivateRoute
                        permisoNecesario={CURSOS}
                        autorizacionNecesaria={ESCRITURA}
                        element={<CrearCursos />}
                    />
                }
            />
        </Routes>
    );
};

export default GestionCursosRoutes;
