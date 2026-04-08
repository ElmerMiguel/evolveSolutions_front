const BASE_URL = import.meta.env.VITE_API_URL;

export async function http(path, { method = "GET", body } = {}) {
    const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
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
