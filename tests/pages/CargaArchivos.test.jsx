import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CargaArchivos from "../../src/pages/CargaArchivos.jsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("CargaArchivos - Test Final", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });


  it("debe bloquear la carga si no hay solicitud activa", () => {
    render(
      <MemoryRouter>
        <CargaArchivos />
      </MemoryRouter>
    );

    expect(screen.getByText(/No hay una solicitud activa/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("debe cargar un archivo correctamente y mostrarlo en la tabla", async () => {
    localStorage.setItem("solicitudActivaId", "100");

    render(
      <MemoryRouter>
        <CargaArchivos />
      </MemoryRouter>
    );

    // 1. Seleccionar tipo
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "identificacion" } });

    // 2. Simular archivo
    const file = new File(["test"], "documento.pdf", { type: "application/pdf" });
    const input = document.querySelector('input[type="file"]'); 
    
    fireEvent.change(input, { target: { files: [file] } });

    // 3. Verificar tabla
    await waitFor(() => {
      expect(screen.getByText("documento.pdf")).toBeInTheDocument();
      expect(screen.getByText("Certificación de cursos aprobados")).toBeInTheDocument(); 
    });
  });

  it("debe validar el tamaño máximo del archivo", async () => {
    localStorage.setItem("solicitudActivaId", "100");

    render(
      <MemoryRouter>
        <CargaArchivos />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "otro" } });

    // Archivo de 6MB (simulado)
    const bigFile = new File(["a".repeat(6 * 1024 * 1024)], "grande.pdf", { type: "application/pdf" });
    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [bigFile] } });

    expect(await screen.findByText(/supera el límite de 5 MB/i)).toBeInTheDocument();
  });

  it("debe guardar en localStorage y redirigir", async () => {
    localStorage.setItem("solicitudActivaId", "500");
    localStorage.setItem("solicitudes", JSON.stringify([{ id: 500, cantidadArchivos: 0 }]));

    render(
      <MemoryRouter>
        <CargaArchivos />
      </MemoryRouter>
    );

    // Cargar  para habilitar el guardado lógico
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "carta_solicitud" } });
    const file = new File(["..."], "carta.png", { type: "image/png" });
    fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [file] } });

    const btnGuardar = screen.getByRole("button", { name: /Guardar archivos/i });
    fireEvent.click(btnGuardar);

    await waitFor(() => {
      const storage = JSON.parse(localStorage.getItem("archivosSolicitud"));
      expect(storage.length).toBeGreaterThan(0);
      expect(mockNavigate).toHaveBeenCalledWith("/solicitudes");
    });
  });

  it("debe eliminar un archivo cargado de la lista temporal", async () => {
    localStorage.setItem("solicitudActivaId", "100");

    render(
      <MemoryRouter>
        <CargaArchivos />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "otro" } });
    const file = new File(["..."], "borrame.jpg", { type: "image/jpeg" });
    fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [file] } });

    expect(screen.getByText("borrame.jpg")).toBeInTheDocument();

    const btnEliminar = screen.getByRole("button", { name: /Eliminar/i });
    fireEvent.click(btnEliminar);

    expect(screen.queryByText("borrame.jpg")).not.toBeInTheDocument();
  });
});