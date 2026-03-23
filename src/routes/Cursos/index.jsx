import {PERMISOS_CURSOS} from "../../entities/permisos/cursos.js";
import {TIPOS_AUTORIZACIONES} from "../../entities/enums/TiposAutorizacion.js";
import GestionCursosRoutes from "./GestionCursosRoutes.jsx";
import PrivateRoute from "../../components/PrivateRoute/index.jsx";

const { CURSOS } = PERMISOS_CURSOS;
const { LECTURA } = TIPOS_AUTORIZACIONES;

const cursosRoutes = [
    {
        permiso: CURSOS,
        tipoAutorizacion: LECTURA,
        name: "Gestión Cursos",
        key: "cursos",
        route: "/cursos",
        to: "/cursos/*",
        component: (
            <PrivateRoute
                permisoNecesario={CURSOS}
                autorizacionNecesaria={LECTURA}
                element={<GestionCursosRoutes />}
            />
        )
    },
]

export default cursosRoutes;