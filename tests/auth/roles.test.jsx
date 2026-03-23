import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProtectedRoute from "../../src/contexts/auth/ProtectedRoute";
import { MemoryRouter, Routes, Route } from "react-router-dom";

describe("ProtectedRoute", () => {
    it("redirects to login if no token", () => {
        localStorage.removeItem("token");

        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <div>Dashboard</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("renders children if token exists", () => {
        localStorage.setItem("token", "fake-token");

        render(
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <div>Dashboard</div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
});
