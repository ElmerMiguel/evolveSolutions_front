import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SolicitudEquivalencia from "./pages/SolicitudEquivalencia";
import Solicitudes from "./pages/Solicitudes";
import CargaArchivos from "./pages/CargaArchivos";
import DocumentosCargados from "./pages/DocumentosCargados";
import DetalleSolicitud from "./pages/DetalleSolicitud";
import DocenteCursos from "./pages/DocenteCursos";
import EstudianteCursos from "./pages/EstudianteCursos";
import ProgramasFirmados from "./pages/ProgramasFirmados";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/solicitud-equivalencia"
        element={
          <ProtectedRoute>
            <SolicitudEquivalencia />
          </ProtectedRoute>
        }
      />

      <Route
        path="/solicitudes"
        element={
          <ProtectedRoute>
            <Solicitudes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/solicitudes/:id"
        element={
          <ProtectedRoute>
            <DetalleSolicitud />
          </ProtectedRoute>
        }
      />

      <Route
        path="/carga-archivos"
        element={
          <ProtectedRoute>
            <CargaArchivos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documentos-cargados"
        element={
          <ProtectedRoute>
            <DocumentosCargados />
          </ProtectedRoute>
        }
      />

      <Route
        path="/docente-cursos"
        element={
          <ProtectedRoute>
            <DocenteCursos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/estudiante-cursos"
        element={
          <ProtectedRoute>
            <EstudianteCursos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/programas-firmados"
        element={
          <ProtectedRoute>
            <ProgramasFirmados />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}