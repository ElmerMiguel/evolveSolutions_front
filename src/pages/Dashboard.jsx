// import { useEffect, useState } from "react";
// import { useAuth } from "../contexts/auth/AuthContext.jsx";
// import {
//     setLayout,
//     useLayoutController,
// } from "../contexts/layout/LayoutContext.jsx";
// import { useNavigate, Link } from "react-router-dom";

// export default function Dashboard() {
//     const navigate = useNavigate();
//     const { token, rol, user } = useAuth();
//     const [, dispatch] = useLayoutController();
//     const [greeting, setGreeting] = useState("Bienvenido");
//     const nav = useNavigate();

//     useEffect(() => {
//         if (!token) {
//             navigate("/login");
//         }
//         setLayout(dispatch, "dashboard");
//     }, [token]);

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6">
//             <div className="mx-auto max-w-7xl space-y-6">
//                 <div className="rounded-3xl border border-white/70 bg-white/70 p-6 shadow-xl shadow-brand-500/10">
//                     <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//                         <div>
//                             <h1 className="text-3xl font-bold text-slate-900">
//                                 Dashboard
//                             </h1>
//                             <p className="mt-2 text-sm text-slate-600">
//                                 Bienvenido al sistema de gestión de
//                                 equivalencias.
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
//                     <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
//                         <h2 className="text-xl font-semibold text-slate-900">
//                             Nueva solicitud
//                         </h2>
//                         <p className="mt-2 text-sm leading-6 text-slate-600">
//                             Registra una nueva solicitud de equivalencia de
//                             cursos para iniciar el proceso de revisión.
//                         </p>

//                         <div className="mt-6">
//                             <Link
//                                 to="/solicitud-equivalencia"
//                                 className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
//                             >
//                                 Ir al formulario
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
//                         <h2 className="text-xl font-semibold text-slate-900">
//                             Solicitudes registradas
//                         </h2>
//                         <p className="mt-2 text-sm leading-6 text-slate-600">
//                             Consulta el listado de solicitudes guardadas y su
//                             estado actual.
//                         </p>

//                         <div className="mt-6">
//                             <Link
//                                 to="/solicitudes"
//                                 className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                             >
//                                 Ver solicitudes
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
//                         <h2 className="text-xl font-semibold text-slate-900">
//                             Carga de archivos
//                         </h2>
//                         <p className="mt-2 text-sm leading-6 text-slate-600">
//                             Adjunta los documentos que respaldan la solicitud de
//                             equivalencia.
//                         </p>

//                         <div className="mt-6">
//                             <Link
//                                 to="/carga-archivos"
//                                 className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                             >
//                                 Cargar archivos
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
//                         <h2 className="text-xl font-semibold text-slate-900">
//                             Documentos cargados
//                         </h2>
//                         <p className="mt-2 text-sm leading-6 text-slate-600">
//                             Revisa el listado de documentos almacenados en el
//                             sistema.
//                         </p>

//                         <div className="mt-6">
//                             <Link
//                                 to="/documentos-cargados"
//                                 className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                             >
//                                 Ver documentos
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
//                         <h2 className="text-xl font-semibold text-slate-900">
//                             Cursos del docente
//                         </h2>
//                         <p className="mt-2 text-sm leading-6 text-slate-600">
//                             Registra y consulta los cursos que imparte cada
//                             docente.
//                         </p>

//                         <div className="mt-6">
//                             <Link
//                                 to="/docente-cursos"
//                                 className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                             >
//                                 Registrar cursos
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
//                         <h2 className="text-xl font-semibold text-slate-900">
//                             Cursos ganados
//                         </h2>
//                         <p className="mt-2 text-sm leading-6 text-slate-600">
//                             Registra y consulta los cursos aprobados por los
//                             estudiantes.
//                         </p>

//                         <div className="mt-6">
//                             <Link
//                                 to="/estudiante-cursos"
//                                 className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                             >
//                                 Registrar cursos
//                             </Link>
//                         </div>
//                     </div>

//                     <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
//                         <h2 className="text-xl font-semibold text-slate-900">
//                             Programas firmados
//                         </h2>
//                         <p className="mt-2 text-sm leading-6 text-slate-600">
//                             Administra la carga de programas firmados por curso
//                             y docente.
//                         </p>

//                         <div className="mt-6">
//                             <Link
//                                 to="/programas-firmados"
//                                 className="inline-flex rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                             >
//                                 Cargar programas
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }



import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/auth/AuthContext.jsx";
import {
  setLayout,
  useLayoutController,
} from "../contexts/layout/LayoutContext.jsx";

export default function DashboardModerno() {
  const navigate = useNavigate();
  const { token, rol, user } = useAuth();
  const [, dispatch] = useLayoutController();
  const [greeting, setGreeting] = useState("Bienvenido");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    setLayout(dispatch, "dashboard");

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días");
    else if (hour < 18) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");
  }, [token, dispatch, navigate]);

  const userName = user?.firstName || user?.username || "Usuario";

  // -- Vistas por Rol --
  const renderStudentDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      

      {/* Cursos Aprobados */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl w-max mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Cursos Ganados</h3>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
        Registra y consulta los cursos aprobados por los
        //                             estudiantes.
        </p>
        <button
          onClick={() => navigate("/estudiante/cursos")}
          className="mt-4 px-4 py-2 bg-slate-50 text-brand-600 rounded-xl font-semibold hover:bg-brand-50 transition-colors w-full border border-slate-200 truncate"
        >
          Ver Cursos
        </button>
      </div>

      {/* Nueva Solicitud de Equivalencia */}
      <div className="bg-gradient-to-br from-brand-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg shadow-brand-500/30 hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="p-3 text-white rounded-2xl w-max mb-4 bg-white/20">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold">Nueva Solicitud</h3>
        <p className="text-indigo-100 mt-2 text-sm leading-relaxed">
          Envía tu programa certificado para revisión ágil.
        </p>
        <button
          onClick={() => navigate("/estudiante/nueva-solicitud")}
          className="mt-4 px-4 py-2 bg-white text-indigo-700 rounded-xl font-bold hover:bg-slate-50 focus:ring-4 focus:ring-indigo-300 transition-all w-full truncate"
        >
          Crear Solicitud
        </button>
      </div>

      {/* Solicitudes Registradas */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-max mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          Solicitudes Registradas
        </h3>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          Consulta el estado de tus solicitudes enviadas.
        </p>
        <button
          onClick={() => navigate("/estudiante/solicitudes")}
          className="mt-4 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors w-full border border-slate-200 truncate"
        >
          Ver Solicitudes
        </button>
      </div>

      {/* Carga de Archivos */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl w-max mb-4">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0-6l3 3m-3-3l-3 3M4 6h16M4 10h16"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Carga de Archivos</h3>
        <p className="text-slate-500 mt-2 text-sm leading-relaxed">
          Sube los archivos de equivalencia necesarios para tus solicitudes.
        </p>
        <button
          onClick={() => navigate("/estudiante/carga-archivos")}
          className="mt-4 px-4 py-2 bg-slate-50 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors w-full border border-slate-200 truncate"
        >
          Subir Archivos
        </button>
      </div>
    </div>
  );

  const renderTeacherDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {/* Mis Cursos */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-8 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Mis Cursos</h3>
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>
        <p className="text-slate-500 mb-6 leading-relaxed">
          Gestiona los cursos que impartes en la universidad para el período
          actual y el histórico de tus asignaciones formales académicas.
        </p>
        <button
          onClick={() => navigate("/cursos")}
          className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl shadow-md shadow-brand-500/20 hover:bg-brand-700 transition-all"
        >
          Administrar Mis Cursos
        </button>
      </div>

      {/* Programas Firmados */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-8 rounded-3xl shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all"></div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Programas Firmados
        </h3>
        <p className="text-slate-500 mb-6 leading-relaxed">
          Administra la carga de programas firmados por curso y docente.
        </p>
        <button
          onClick={() => navigate("/programas/upload")}
          className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl shadow-md hover:bg-amber-600 transition-all"
        >
          Subir Programa
        </button>
      </div>

      {/* Cursos del Docente */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-8 rounded-3xl shadow-lg">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Cursos del Docente
        </h3>
        <p className="text-slate-500 mb-6 leading-relaxed">
          Registra y consulta los cursos que impartes.
        </p>
        <button
          onClick={() => navigate("/docente/cursos")}
          className="w-full py-3 bg-slate-100 text-slate-800 font-semibold rounded-xl shadow-sm hover:bg-slate-200 transition-all"
        >
          Ir a cursos
        </button>
      </div>

      {/* Documentos Cargados */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-8 rounded-3xl shadow-lg">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          Documentos Cargados
        </h3>
        <p className="text-slate-500 mb-6 leading-relaxed">
          Revisa el listado de documentos almacenados en el sistema.
        </p>
        <button
          onClick={() => navigate("/docente/documentos")}
          className="w-full py-3 bg-slate-100 text-slate-800 font-semibold rounded-xl shadow-sm hover:bg-slate-200 transition-all"
        >
          Ver documentos
        </button>
      </div>
    </div>
  );

  const renderSecretaryDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Pendientes
            </p>
            <h2 className="text-4xl font-black text-slate-800 mt-2">12</h2>
            <button
              onClick={() => navigate("/secretaria/cambio-estado")}
              className="flex items-center gap-2 mt-4 text-sm text-brand-600 font-medium cursor-pointer hover:underline"
            >
              Ir a revisión{" "}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </button>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Aprobadas (Mensual)
            </p>
            <h2 className="text-4xl font-black text-emerald-600 mt-2">45</h2>
            <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-emerald-700 bg-emerald-50 w-max px-2 py-1 rounded-md pr-3">
              <span className="text-emerald-500">▲</span> 12% vs mes anterior
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Rechazadas
            </p>
            <h2 className="text-4xl font-black text-rose-500 mt-2">8</h2>
            <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
              Mayoritariamente por programas incompletos o faltantes del
              docente.
            </p>
          </div>
        </div>
        <div className="col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">Generación de Reportes</h3>
            <p className="text-sm text-slate-300 mt-2 opacity-80 leading-relaxed font-light">
              Exporta informes y estadísticas actualizadas en PDF y Excel para
              la administración del CUNOC.
            </p>
          </div>
          <button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-xl backdrop-blur-sm transition-all text-sm">
            Crear Reporte <span className="ml-1 opacity-70">↓</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
            Revisión Ágil de Trámites
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">
              Filtros
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold rounded-l-lg">
                  Expediente
                </th>
                <th className="px-4 py-3 font-semibold">CUI Estudiante</th>
                <th className="px-4 py-3 font-semibold">Carrera Origen</th>
                <th className="px-4 py-3 font-semibold">Fecha Envío</th>
                <th className="px-4 py-3 font-semibold text-right rounded-r-lg">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4 font-bold text-slate-800">
                  EQ-2026-0012
                </td>
                <td className="px-4 py-4">3014 55982 0901</td>
                <td className="px-4 py-4">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 text-xs font-semibold">
                    T1 - Ing. Civil
                  </span>
                </td>
                <td className="px-4 py-4">Hace 2 horas</td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => navigate("/secretaria/cambio-estado")}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    Revisar »
                  </button>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-4 font-bold text-slate-800">
                  EQ-2026-0013
                </td>
                <td className="px-4 py-4">2998 12345 0901</td>
                <td className="px-4 py-4">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 text-xs font-semibold">
                    T2 - Ing. Sistemas
                  </span>
                </td>
                <td className="px-4 py-4">Hace 5 horas</td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => navigate("/secretaria/cambio-estado")}
                    className="text-brand-600 font-bold hover:underline"
                  >
                    Revisar »
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {greeting},{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">
                {userName}
              </span>
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              SISTEMA DE GESTIÓN DE EQUIVALENCIAS Y HOMOLOGACIONES
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {rol}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Evolve Solutions
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Display based on Database Role code */}
        {rol === "STUDENT" && renderStudentDashboard()}
        {rol === "TEACHER" && renderTeacherDashboard()}
        {(rol === "SECRETARY" || rol === "ADMIN") && renderSecretaryDashboard()}
      </div>
    </div>
  );
}
