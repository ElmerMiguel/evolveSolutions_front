import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/pages/auth/Login.jsx";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
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
    login: mockLogin,
  }),
}));

vi.mock("../../src/contexts/layout/LayoutContext.jsx", () => ({
  useLayoutController: () => [{}, mockDispatch],
  setLayout: vi.fn(),
}));

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe mostrar error cuando las credenciales son incorrectas", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Credenciales inválidas"));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("correo@dominio.com"), {
      target: { value: "error@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    const errorMsg = await screen.findByText("Credenciales inválidas");
    expect(errorMsg).toBeInTheDocument();
  });

  it("debe llamar a login y redirigir al dashboard si los datos son correctos", async () => {
    mockLogin.mockResolvedValueOnce({ user: "test-user" });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("correo@dominio.com"), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
      target: { value: "admin123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        identifier: "admin@test.com",
        password: "admin123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("debe deshabilitar el botón mientras está cargando (busy)", async () => {
    mockLogin.mockReturnValue(new Promise((res) => setTimeout(res, 500)));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Llenar campos requeridos 
    fireEvent.change(screen.getByPlaceholderText("correo@dominio.com"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
      target: { value: "123456" },
    });

    const submitBtn = screen.getByRole("button", { name: /ingresar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
      expect(screen.getByText("Ingresando...")).toBeInTheDocument();
    });
  });
});