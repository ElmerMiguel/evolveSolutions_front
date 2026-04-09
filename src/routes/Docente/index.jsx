import PrivateRoute from "../../components/PrivateRoute";
import GestionDocenteRoutes from "./GestionDocenteRoutes";

const docenteRoutes = [
  {
    name: "Docente",
    key: "docente",
    route: "docente/*",
    component: (
      <PrivateRoute element={<GestionDocenteRoutes />} />
    ),
  },
];

export default docenteRoutes;