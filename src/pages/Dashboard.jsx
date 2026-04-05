import {useEffect, useState} from "react";
import {useAuth} from "../contexts/auth/AuthContext.jsx";
import {setLayout, useLayoutController} from "../contexts/layout/LayoutContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, rol, user } = useAuth();
  const [, dispatch] = useLayoutController();
  const [greeting, setGreeting] = useState("Bienvenido");
  const nav = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
        setLayout(dispatch, "dashboard");
    }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl shadow-brand-500/10 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Bienvenido al sistema de gestión de equivalencias.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Nueva solicitud
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Registra una nueva solicitud de equivalencia de cursos para iniciar el proceso de revisión.
            </p>

            <div className="mt-6">
              <Link
                to="/solicitud-equivalencia"
                className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Ir al formulario
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Solicitudes registradas
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Consulta el listado de solicitudes guardadas y su estado actual.
            </p>

            <div className="mt-6">
              <Link
                to="/solicitudes"
                className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ver solicitudes
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Carga de archivos
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Adjunta los documentos que respaldan la solicitud de equivalencia.
            </p>

            <div className="mt-6">
              <Link
                to="/carga-archivos"
                className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cargar archivos
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Documentos cargados
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Revisa el listado de documentos almacenados en el sistema.
            </p>

            <div className="mt-6">
              <Link
                to="/documentos-cargados"
                className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ver documentos
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Cursos del docente
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Registra y consulta los cursos que imparte cada docente.
            </p>

            <div className="mt-6">
              <Link
                to="/docente-cursos"
                className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Registrar cursos
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Cursos ganados
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Registra y consulta los cursos aprobados por los estudiantes.
            </p>

            <div className="mt-6">
              <Link
                to="/estudiante-cursos"
                className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Registrar cursos
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Programas firmados
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Administra la carga de programas firmados por curso y docente.
            </p>

            <div className="mt-6">
              <Link
                to="/programas-firmados"
                className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cargar programas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}