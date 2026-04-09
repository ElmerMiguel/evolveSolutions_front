import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import Loadable from "../../components/Loadable/index.jsx";

const UploadProgram = Loadable(lazy(() => import("../../pages/Programas/UploadProgram")));

const GestionProgramasRoutes = () => {
    const routes = useRoutes([
        {
            path: "upload", 
            element: <UploadProgram />,
        } 
    ]);

    return routes;
};

export default GestionProgramasRoutes;