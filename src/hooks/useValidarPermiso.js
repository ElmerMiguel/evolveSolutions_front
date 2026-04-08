import { useAuth } from "../contexts/auth/AuthContext.jsx";

const useValidarPermiso = () => {
    const { permisos } = useAuth();

    const validarPermiso = (permiso, tipo) => {
        if (!permisos) return false;

        return permisos.some((item) => {
            return (
                item.PermisoID?.toUpperCase() === permiso?.toUpperCase() &&
                item.NivelEscritura >= tipo
            );
        });
    };

    return { validarPermiso };
};

export default useValidarPermiso;
