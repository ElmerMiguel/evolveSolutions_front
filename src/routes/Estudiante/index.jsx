import PrivateRoute from "../../components/PrivateRoute";
import GestionEstudianteRoutes from "./GestionEstudianteRoutes";

const estudianteRoutes = [
  {
    name: "Estudiante",
    key: "estudiante",
    route: "estudiante/*",
    to: "/estudiante/nueva-solicitud",
    component: <PrivateRoute element={<GestionEstudianteRoutes />} />,
  },
];

export default estudianteRoutes;
