import { Box, Input, Button, VStack, Heading, Link } from "@chakra-ui/react";
import { authSignup, authLogout, checkTokenExpired } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Mountain } from "lucide-react";

export default function SignupPage() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!checkTokenExpired()) {
            navigate("/dashboard");
        }
    }, []);

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
        <Box
            maxW="400px"
            mx="auto"
            minH="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <VStack w="100%">
                <Heading display={"flex"} fontSize="3xl">
                    <Mountain size={"28px"} />
                    BoulderTracker
                </Heading>
                <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                    <VStack gap="8px">
                        <Input
                            name="username"
                            type="text"
                            placeholder="Username"
                            border="none"
                            bg="#ffffff"
                            fontSize="md"
                            boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                        />
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
                            Sign Up
                        </Button>
                        <Link href="/login" color="#482307">
                            Already have an account? Log In
                        </Link>
                    </VStack>
                </form>
            </VStack>
        </Box>
    );
}
