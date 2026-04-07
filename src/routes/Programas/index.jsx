import PrivateRoute from "../../components/PrivateRoute/index.jsx";
import GestionProgramasRoutes from "./GestionProgramasRoutes.jsx";
import { PERMISOS_PROGRAMAS } from "./permisos.js";
import { TIPOS_AUTORIZACIONES } from "../../entities/enums/TiposAutorizacion.js";

const programsRoutes = [
    {
        name: "Programas",
        key: "programas-main",
        route: "programas/*",
        component: (
            <PrivateRoute
                // permisoNecesario={PERMISOS_PROGRAMAS.PROGRAMAS}
                // autorizacionNecesaria={TIPOS_AUTORIZACIONES.LECTURA}
                element={<GestionProgramasRoutes />}
            />
        )
    }
];

export default programsRoutes;