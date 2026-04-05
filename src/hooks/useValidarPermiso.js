import {useAuth} from "../contexts/auth/AuthContext.jsx";


const useValidarPermiso = () => {
    const { permisos } = useAuth();

    const validarPermiso = (PermisoID, TipoAutorizacion) => {
        if (permisos) {
            const permiso = permisos.find(
                (item) =>
                    item.PermisoID === PermisoID &&
                    item.NivelEscritura >= TipoAutorizacion
            );

            if (permiso) return true;
        }
        return false;
    }

    return { validarPermiso };
}
 export default useValidarPermiso;
