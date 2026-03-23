import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Login from "../../src/pages/auth/Login.jsx";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Login page", () => {
    it("should login and redirect to dashboard", async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        token: "fake-token",
                        session: { user: "test" },
                    }),
            })
        );

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("correo@dominio.com"), {
            target: { value: "test@mail.com" },
        });

        fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByText("Ingresar"));

        await waitFor(() => {
            expect(localStorage.getItem("token")).toBe("fake-token");
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
        });
    });
});
