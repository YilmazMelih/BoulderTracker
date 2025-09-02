import { Box, Input, Button } from "@chakra-ui/react";
import { authLogin, checkTokenExpired, authLogout } from "../api/api.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    if (!checkTokenExpired()) {
        navigate("/dashboard");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");
        const res = await authLogin(email, password);
        if (res.token) {
            localStorage.setItem("token", res.token);
            navigate("/dashboard");
        }
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Input name="email" type="email" placeholder="Email" />
                <Input name="password" type="password" placeholder="Password" />
                <Button type="submit">Login</Button>
            </form>
        </Box>
    );
}
