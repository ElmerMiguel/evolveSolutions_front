const resolvedApiUrl =
    window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : import.meta.env.VITE_API_URL;

const BASE_URL = resolvedApiUrl?.replace(/\/$/, "") ?? "";

export async function http(path, { method = "GET", body, token } = {}) {
    const isFormData =
        typeof FormData !== "undefined" && body instanceof FormData;

    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: body
            ? isFormData
                ? body
                : JSON.stringify(body)
            : undefined,
    });

    let data;
    try {
        data = await res.json();
    } catch {
        data = {};
    }

    return {
        status: res.status,
        statusText: res.statusText,
        data,
    };
}
