import { Box, Input, Button, VStack } from "@chakra-ui/react";
import { authLogin, checkTokenExpired, authLogout } from "../api/api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
        if (res.error) {
            toast.error(res.error);
        }
        if (res.token) {
            localStorage.setItem("token", res.token);
            navigate("/dashboard");
        }
    };

    return (
        <Box
            maxW="400px"
            mx="auto"
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <VStack gap="8px">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        border="none"
                        bg="#ffffff"
                        fontSize="md"
                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        border="none"
                        bg="#ffffff"
                        fontSize="md"
                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                    />
                    <Button
                        type="submit"
                        w="100%"
                        bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                        fontWeight="bold"
                        fontSize="md"
                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                    >
                        Login
                    </Button>
                </VStack>
            </form>
        </Box>
    );
}
