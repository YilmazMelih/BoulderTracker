import { Box, Input, Button } from "@chakra-ui/react";
import { authSignup, authLogout, checkTokenExpired } from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignupPage() {
    const navigate = useNavigate();
    if (!checkTokenExpired()) {
        navigate("/dashboard");
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");
        const email = formData.get("email");
        const password = formData.get("password");
        const res = await authSignup(username, email, password);
        if (res.error) {
            toast.error(res.error);
        }
        if (res.token) {
            localStorage.setItem("token", res.token);
            navigate("/dashboard");
        }
    };

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Input name="username" type="text" placeholder="Username" />
                <Input name="email" type="email" placeholder="Email" />
                <Input name="password" type="password" placeholder="Password" />
                <Button type="submit">Sign Up</Button>
            </form>
        </Box>
    );
}
