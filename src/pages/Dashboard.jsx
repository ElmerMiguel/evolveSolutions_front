import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../contexts/auth/AuthContext.jsx";
import {setLayout, useLayoutController} from "../contexts/layout/LayoutContext.jsx";

export default function Dashboard() {
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
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl w-max mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Cursos Aprobados</h3>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">Sube tu certificación del SIRECA y visualiza aquí tu progreso académico y los cursos listos para equivalencias.</p>
              <button className="mt-4 px-4 py-2 bg-slate-50 text-brand-600 rounded-xl font-semibold hover:bg-brand-50 transition-colors w-full border border-slate-200 truncate">Ver expediente académico</button>
          </div>
          <div className="bg-gradient-to-br from-brand-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg shadow-brand-500/30 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="p-3 text-white rounded-2xl w-max mb-4 bg-white/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold">Solicitudes de Equivalencias</h3>
              <p className="text-indigo-100 mt-2 text-sm leading-relaxed">Envía tus programas certificados para su revisión ágil por la secretaría usando plantillas estandarizadas de la USAC.</p>
              <button className="mt-4 px-4 py-2 bg-white text-indigo-700 rounded-xl font-bold hover:bg-slate-50 focus:ring-4 focus:ring-indigo-300 transition-all w-full truncate">Crear Nueva Solicitud</button>
          </div>
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-max mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Estado de Trámites</h3>
              <ul className="mt-3 space-y-2">
                  <li className="flex items-center justify-between text-sm"><span className="text-slate-600 font-medium">Enviadas:</span> <span className="text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-md">2</span></li>
                  <li className="flex items-center justify-between text-sm"><span className="text-slate-600 font-medium">En Revisión:</span> <span className="text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md">1</span></li>
                  <li className="flex items-center justify-between text-sm"><span className="text-slate-600 font-medium">Finalizadas:</span> <span className="text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-md">4</span></li>
              </ul>
              <button className="mt-4 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors w-full border border-slate-200 text-xs">Ver notificaciones</button>
          </div>
      </div>
  );

  const renderTeacherDashboard = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-8 rounded-3xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Mis Cursos</h3>
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
              </div>
              <p className="text-slate-500 mb-6 leading-relaxed">Gestiona los cursos que impartes en la universidad para el período actual y el histórico de tus asignaciones formales académicas.</p>
              <button onClick={() => navigate('/cursos')} className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl shadow-md shadow-brand-500/20 hover:bg-brand-700 transition-all">Administrar Mis Cursos</button>
          </div>
          <div className="bg-white/90 backdrop-blur-md border border-slate-100 p-8 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all"></div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Programas Firmados</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">Sube el programa oficial certificado de tus asignaturas. Esto es vital para las solicitudes de equivalencia de los estudiantes.</p>
              <div className="flex items-center p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-brand-50 hover:border-brand-300 transition-colors cursor-pointer group-hover:border-brand-400">
                  <svg className="w-8 h-8 text-slate-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <div>
                      <p className="text-sm font-bold text-brand-700">Subir Documento (PDF)</p>
                      <p className="text-xs text-slate-500">Haz clic o arrastra el programa aquí</p>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderSecretaryDashboard = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pendientes</p>
                      <h2 className="text-4xl font-black text-slate-800 mt-2">12</h2>
                      <div className="flex items-center gap-2 mt-4 text-sm text-brand-600 font-medium cursor-pointer hover:underline">Ir a revisión <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Aprobadas (Mensual)</p>
                      <h2 className="text-4xl font-black text-emerald-600 mt-2">45</h2>
                      <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-emerald-700 bg-emerald-50 w-max px-2 py-1 rounded-md pr-3"><span className="text-emerald-500">▲</span> 12% vs mes anterior</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Rechazadas</p>
                      <h2 className="text-4xl font-black text-rose-500 mt-2">8</h2>
                      <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">Mayoritariamente por programas incompletos o faltantes del docente.</p>
                  </div>
              </div>
              <div className="col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                  <div>
                      <h3 className="text-lg font-bold">Generación de Reportes</h3>
                      <p className="text-sm text-slate-300 mt-2 opacity-80 leading-relaxed font-light">Exporta informes y estadísticas actualizadas en PDF y Excel para la administración del CUNOC.</p>
                  </div>
                  <button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 rounded-xl backdrop-blur-sm transition-all text-sm">Crear Reporte <span className="ml-1 opacity-70">↓</span></button>
              </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500"></span> 
                    Revisión Ágil de Trámites
                </h3>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Filtros</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                      <thead className="text-xs uppercase bg-slate-50 text-slate-500">
                          <tr>
                              <th className="px-4 py-3 font-semibold rounded-l-lg">Expediente</th>
                              <th className="px-4 py-3 font-semibold">CUI Estudiante</th>
                              <th className="px-4 py-3 font-semibold">Carrera Origen</th>
                              <th className="px-4 py-3 font-semibold">Fecha Envío</th>
                              <th className="px-4 py-3 font-semibold text-right rounded-r-lg">Acción</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-4 font-bold text-slate-800">EQ-2026-0012</td>
                              <td className="px-4 py-4">3014 55982 0901</td>
                              <td className="px-4 py-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 text-xs font-semibold">T1 - Ing. Civil</span></td>
                              <td className="px-4 py-4">Hace 2 horas</td>
                              <td className="px-4 py-4 text-right">
                                  <button onClick={() => navigate('/dashboard')} className="text-brand-600 font-bold hover:underline">Revisar »</button>
                              </td>
                          </tr>
                          <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-4 font-bold text-slate-800">EQ-2026-0013</td>
                              <td className="px-4 py-4">2998 12345 0901</td>
                              <td className="px-4 py-4"><span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100 text-xs font-semibold">T2 - Ing. Sistemas</span></td>
                              <td className="px-4 py-4">Hace 5 horas</td>
                              <td className="px-4 py-4 text-right">
                                  <button onClick={() => navigate('/dashboard')} className="text-brand-600 font-bold hover:underline">Revisar »</button>
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
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">{userName}</span>
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
                  <p className="text-sm font-bold text-slate-800 leading-tight">{rol}</p>
                  <p className="text-xs text-slate-500 font-medium">Evolve Solutions</p>
              </div>
          </div>
        </div>

        {/* Dynamic Display based on Database Role code */}
        { rol === "STUDENT" && renderStudentDashboard() }
        { rol === "TEACHER" && renderTeacherDashboard() }
        { (rol === "SECRETARY" || rol === "ADMIN") && renderSecretaryDashboard() }

      </div>
    </div>
  );
}