import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadProgram = () => {
  const [file, setFile] = useState(null);
  const [teacherCourseId, setTeacherCourseId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!file) {
      alert("Selecciona un archivo PDF");
      return;
    }
    if (!teacherCourseId) {
      alert("Selecciona un curso");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("teacher_course_id", teacherCourseId);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/programas/upload`, // ✅ variable de entorno
        {
          method: "POST",
          credentials: "include", // ✅ envía la cookie con el token
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Error al subir archivo");
        return;
      }

      alert("Archivo subido correctamente");
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver al dashboard
        </button>

        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Subir programa firmado
          </h2>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Sube el programa oficial certificado de tu asignatura en formato
            PDF.
          </p>

          {/* Selector de curso */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Curso
            </label>
            <select
              value={teacherCourseId}
              onChange={(e) => setTeacherCourseId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">— Selecciona un curso —</option>
              <option value="1">Matemática 1</option>
              <option value="2">Programación</option>
            </select>
          </div>

          {/* Zona de carga */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
              Documento PDF
            </label>
            <input
              type="file"
              accept="application/pdf"
              id="fileInput"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div
              onClick={() => document.getElementById("fileInput").click()}
              className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-colors cursor-pointer"
            >
              <svg
                className="w-8 h-8 text-slate-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5v-9m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Haz clic o arrastra el programa aquí
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Solo archivos PDF · Máximo 10 MB
                </p>
              </div>
            </div>

            {/* Nombre del archivo seleccionado */}
            {file && (
              <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 mt-2">
                {file.name}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Subir programa
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadProgram;
