import {useAuth} from "../contexts/auth/AuthContext.jsx";


const useValidarPermiso = () => {
    const { permisos } = useAuth();

    const validarPermiso = (PermisoID, TipoAutorizacion) => {
        console.log("permisos del usuario:", permisos);
        console.log("buscando:", { PermisoID, TipoAutorizacion });

        if (permisos) {
            const permiso = permisos.find(
                (item) =>
                    item.PermisoID === PermisoID &&
                    item.NivelEscritura >= TipoAutorizacion
            );
            console.log("permiso encontrado:", permiso);

            if (permiso) return true;
        }
        return false;
    }

    return { validarPermiso };
}
 export default useValidarPermiso;
