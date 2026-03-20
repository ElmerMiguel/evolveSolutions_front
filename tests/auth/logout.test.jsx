import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AuthProvider, useAuth } from "../../src/contexts/auth/AuthContext";

vi.mock("../../src/api/auth", () => ({
    authApi: {
        logout: vi.fn(() => Promise.resolve()),
    },
}));

describe("AuthContext logout", () => {
    it("should clear token and user on logout", async () => {
        localStorage.setItem("token", "fake-token");

        const wrapper = ({ children }) => (
            <AuthProvider>{children}</AuthProvider>
        );

        const { result } = renderHook(() => useAuth(), { wrapper });

        await act(async () => {
            await result.current.logout();
        });

        expect(localStorage.getItem("token")).toBe(null);
        expect(result.current.token).toBe("");
        expect(result.current.user).toBe(null);
    });
});
