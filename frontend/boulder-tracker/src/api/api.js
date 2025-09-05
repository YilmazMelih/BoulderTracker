import axios from "axios";
import { jwtDecode } from "jwt-decode";

const auth = axios.create({
    baseURL: `http://localhost:3001/auth`,
});

const api = axios.create({
    baseURL: `http://localhost:3001/api`,
});

export async function authLogin(email, password) {
    try {
        const res = await auth.post("/login", {
            email: email,
            password: password,
        });
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function authSignup(username, email, password) {
    try {
        const res = await auth.post("/signup", {
            username: username,
            email: email,
            password: password,
        });
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export function authLogout() {
    localStorage.removeItem("token");
}

export async function apiFetchSessions() {
    const token = localStorage.getItem("token");
    try {
        const res = await api.get("/sessions", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(res.data);
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiCreateSession() {
    const token = localStorage.getItem("token");
    const date = new Date().toISOString().slice(0, 10);
    try {
        const res = await api.post(
            "/sessions",
            {
                date: date,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiFetchClimbs() {
    const token = localStorage.getItem("token");
    try {
        const res = await api.get("/climbs", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiCreateClimb(name, grade, color, photo_url) {
    const token = localStorage.getItem("token");
    try {
        const res = await api.post(
            "/climbs",
            {
                name: name,
                grade: grade,
                ...(color && { color }),
                ...(photo_url && { photo_url }),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiEditClimb(name, grade, color, photo_url, climb_id) {
    const token = localStorage.getItem("token");
    try {
        const res = await api.put(
            `/climbs/${climb_id}`,
            {
                name: name,
                grade: grade,
                ...(color && { color }),
                ...(photo_url && { photo_url }),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiFetchSessionDet(id) {
    const token = localStorage.getItem("token");
    try {
        const res = await api.get(`/sessions/${id}/logs`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiCreateLog(id, climb_id, attempts, flashed, topped) {
    const token = localStorage.getItem("token");

    try {
        const res = await api.post(
            `/sessions/${id}/logs`,
            {
                climb_id: climb_id,
                attempts: attempts,
                flashed: flashed ? flashed : false,
                topped: topped ? topped : false,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiEditLog(id, log_id, attempts, flashed, topped) {
    const token = localStorage.getItem("token");

    try {
        const res = await api.put(
            `/sessions/${id}/logs/${log_id}`,
            {
                attempts: attempts,
                flashed: flashed ? flashed : false,
                topped: topped ? topped : false,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiDeleteClimb(climb_id) {
    const token = localStorage.getItem("token");

    try {
        const res = await api.delete(`/climbs/${climb_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function authDeleteUser() {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    try {
        const res = await auth.delete(`/delete/${decoded.userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        authLogout();
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiDeleteSession(session_id) {
    const token = localStorage.getItem("token");

    try {
        const res = await api.delete(`/sessions/${session_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiDeleteSesh(id) {
    const token = localStorage.getItem("token");

    try {
        const res = await api.delete(`/sessions/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export async function apiDeleteLog(id, log_id) {
    const token = localStorage.getItem("token");

    try {
        const res = await api.delete(`/sessions/${id}/logs/${log_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        return handleError(err);
    }
}

export function checkTokenExpired() {
    const token = localStorage.getItem("token");
    if (!token) {
        return true;
    }
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
}

function handleError(err) {
    if (err.response) {
        if (err.response.data.message == `Invalid or expired token`) {
            console.log("EXPIRED CAUGHT");
        }
        console.error(`Status:`, err.response.status);
        console.error(`Message:`, err.response.data.message);
        return { error: err.response.data.message };
    } else {
        console.error(`Message:`, err.message);
        return { error: `Network error` };
    }
}
