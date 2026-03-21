import { Navigate } from 'react-router-dom';
import {useAuth} from "../../contexts/auth/AuthContext.jsx";
import useValidarPermiso from "../../hooks/useValidarPermiso.js";

const PrivateRoute = ({ element, permisoNecesario, autorizacionNecesaria }) => {
    const { validarPermiso } = useValidarPermiso()
    const { token } = useAuth()


    const hasAuthorization = () => {
        if (permisoNecesario === undefined) {
            return true
        }
        return validarPermiso(permisoNecesario, Number(autorizacionNecesaria))
    }

    return token ? hasAuthorization() ? element : <Navigate to={'/not-authorized'} /> : <Navigate to={'/login'} />
};


export default PrivateRoute;