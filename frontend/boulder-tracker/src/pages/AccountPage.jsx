import Navbar from "../components/Navbar";
import { Box, Button, VStack } from "@chakra-ui/react";
import { authLogout, checkTokenExpired, authDeleteUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AccountPage() {
    const navigate = useNavigate();
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [disabled, setDisabled] = useState(false);

    async function handleDelete() {
        if (deleteConfirm) {
            const res = await authDeleteUser();
            if (!res.error) {
                navigate("/login");
            } else {
                toast.error(res.error);
            }
        } else {
            setDisabled(true);
            toast("Are you you want to delete your account?");
            setTimeout(() => {
                setDisabled(false);
                setDeleteConfirm(true);
            }, 3000);
        }
    }

    useEffect(() => {
        if (checkTokenExpired()) {
            navigate("/login");
        }
    }, []);

    return (
        <>
            <Navbar />
            <Box maxW="400px" m="50px auto">
                <VStack gap="12px">
                    <Button
                        bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                        fontWeight="bold"
                        fontSize="md"
                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                        w="100%"
                        _hover={{ transform: "scale(1.05)" }}
                        transition="transform 0.2s"
                        onClick={() => {
                            authLogout();
                            navigate("/login");
                        }}
                    >
                        Log Out
                    </Button>
                    <Button
                        bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                        fontWeight="bold"
                        fontSize="md"
                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                        w="100%"
                        _hover={{ transform: "scale(1.05)" }}
                        transition="transform 0.2s"
                        disabled={disabled}
                        onClick={() => {
                            handleDelete();
                        }}
                    >
                        Delete Account
                    </Button>
                </VStack>
            </Box>
        </>
    );
}
