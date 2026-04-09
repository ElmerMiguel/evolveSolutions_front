import PrivateRoute from "../../components/PrivateRoute";
import GestionEstudianteRoutes from "./GestionEstudianteRoutes";

const estudianteRoutes = [
  {
    name: "Estudiante",
    key: "estudiante",
    route: "estudiante/*",
    component: <PrivateRoute element={<GestionEstudianteRoutes />} />,
  },
];

export default estudianteRoutes;