import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Register from "../../src/pages/auth/Register.jsx";

const mockNavigate = vi.fn();
const mockRegister = vi.fn();
const mockDispatch = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../src/contexts/auth/AuthContext.jsx", () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

vi.mock("../../src/contexts/layout/LayoutContext.jsx", () => ({
  useLayoutController: () => [{}, mockDispatch],
  setLayout: vi.fn(),
}));

describe("Register Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByPlaceholderText("nombre de usuario"), { target: { value: "jdoe" } });
    fireEvent.change(screen.getByPlaceholderText("Tu nombre"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Tu apellido"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("correo@dominio.com"), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("Crea una contraseña"), { target: { value: "password123" } });
  };

  it("debe registrar exitosamente y redirigir al login", async () => {
    mockRegister.mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("debe mostrar un mensaje de error si el registro falla", async () => {
    const errorMessage = "El correo ya está registrado";
    mockRegister.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fillForm(); // Necesario llenar campos para que el submit se ejecute
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    const alertError = await screen.findByText(errorMessage);
    expect(alertError).toBeInTheDocument();
  });

  it("debe cambiar el estado del botón mientras está procesando", async () => {
    mockRegister.mockReturnValue(new Promise((res) => setTimeout(res, 500)));

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fillForm();
    const submitBtn = screen.getByRole("button", { name: /crear cuenta/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
      expect(screen.getByText("Registrando...")).toBeInTheDocument();
    });
  });
});