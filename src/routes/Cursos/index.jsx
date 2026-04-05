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
        name: "Ver Cursos",
        key: "ver-cursos",
        route: "/cursos",
        to: "/cursos",
        component: (
            <PrivateRoute
                permisoNecesario={CURSOS}
                autorizacionNecesaria={LECTURA}
                element={<GestionCursosRoutes />}
            />
        )
    },
    {
        permiso: CURSOS,
        tipoAutorizacion: TIPOS_AUTORIZACIONES.ESCRITURA,
        name: "Crear Curso",
        key: "crear-curso",
        route: "/cursos/crear",
        to: "/cursos/crear",
    }
]

export default cursosRoutes;