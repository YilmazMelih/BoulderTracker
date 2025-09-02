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

export function checkTokenExpired() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("token dne");
        return true;
    }
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
}

function handleError(err) {
    if (err.response) {
        if (err.response.status == `Invalid or expired token`) {
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
