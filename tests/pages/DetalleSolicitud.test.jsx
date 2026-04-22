import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DetalleSolicitud from "../../src/pages/DetalleSolicitud.jsx";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }), 
  };
});

describe("DetalleSolicitud Page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("debe mostrar un mensaje de error si la solicitud no existe", () => {
    render(
      <MemoryRouter>
        <DetalleSolicitud />
      </MemoryRouter>
    );

    expect(screen.getByText(/Solicitud no encontrada/i)).toBeInTheDocument();
    expect(screen.getByText(/Volver a solicitudes/i)).toBeInTheDocument();
  });

  it("debe mostrar correctamente los datos de la solicitud y sus documentos", () => {
    // 1. prepara la data simulada en localStorage
    const mockSolicitud = {
      id: 1,
      nombre: "Juan Perez",
      carnet: "2023001",
      carrera: "Ingeniería",
      estado: "Pendiente",
      cursoAprobado: "Matemática 1",
      codigoCursoAprobado: "M1",
      cursoEquivalencia: "Cálculo 1",
      codigoCursoEquivalencia: "C1",
      fechaSolicitud: new Date().toISOString(),
      cantidadArchivos: 1,
      observaciones: "Nota de prueba"
    };

    const mockDocumento = {
      id: 101,
      solicitudId: 1,
      tipoDocumentoLabel: "Identificación",
      nombre: "cedula.pdf",
      tipo: "application/pdf",
      tamanio: 1024 * 500, // 500 KB
      fechaCarga: new Date().toISOString(),
      estado: "Cargado"
    };

    localStorage.setItem("solicitudes", JSON.stringify([mockSolicitud]));
    localStorage.setItem("archivosSolicitud", JSON.stringify([mockDocumento]));

    render(
      <MemoryRouter>
        <DetalleSolicitud />
      </MemoryRouter>
    );

    // 2. verif datos generales
    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.getByText("2023001")).toBeInTheDocument();
    expect(screen.getByText("Matemática 1 (M1)")).toBeInTheDocument();
    expect(screen.getByText("Nota de prueba")).toBeInTheDocument();

    // 3. verif que el documento aparezca en la tabla
    expect(screen.getByText("cedula.pdf")).toBeInTheDocument();
    expect(screen.getByText("Identificación")).toBeInTheDocument();
    expect(screen.getByText("500.00 KB")).toBeInTheDocument(); // Prueba la función formatearTamanio
  });

  it("debe mostrar un mensaje si la solicitud existe pero no tiene documentos", () => {
    const mockSolicitud = {
      id: 1,
      nombre: "Maria Garcia",
      estado: "Pendiente"
    };

    localStorage.setItem("solicitudes", JSON.stringify([mockSolicitud]));
    // archivosSolicitud vacío

    render(
      <MemoryRouter>
        <DetalleSolicitud />
      </MemoryRouter>
    );

    expect(screen.getByText("Maria Garcia")).toBeInTheDocument();
    expect(
      screen.getByText(/Esta solicitud no tiene documentos asociados todavía/i)
    ).toBeInTheDocument();
  });

  it("debe manejar observaciones vacías mostrando 'Sin observaciones'", () => {
    const mockSolicitud = {
      id: 1,
      nombre: "Luis Lopez",
      observaciones: "" // Vacio
    };

    localStorage.setItem("solicitudes", JSON.stringify([mockSolicitud]));

    render(
      <MemoryRouter>
        <DetalleSolicitud />
      </MemoryRouter>
    );

    expect(screen.getByText("Sin observaciones")).toBeInTheDocument();
  });
});