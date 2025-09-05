import Navbar from "../components/Navbar";
import GraphPlaceholder from "../components/GraphPlaceholder";
import SessionCard from "../components/cards/SessionCard";
import AddSessionCard from "../components/cards/AddSessionCard";
import { checkTokenExpired, apiFetchSessions, apiCreateSession } from "../api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Heading, Box, Button, Text, VStack, SimpleGrid } from "@chakra-ui/react";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    useEffect(() => {
        if (checkTokenExpired()) {
            navigate("/login");
        }
        const fetch = async () => {
            const data = await apiFetchSessions();
            if (!data.error) {
                setSessions(data.sessions);
            } else {
                toast.error(data.error);
            }
        };
        fetch();
    }, []);

    async function handleCreate() {
        const res = await apiCreateSession();
        if (!res.error) {
            navigate(`/sessions/${res.session.id}`);
        } else {
            toast.error(res.error);
        }
    }

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);

    const usernameCapitalized =
        decoded.username.charAt(0).toUpperCase() + decoded.username.slice(1);
    return (
        <>
            <Navbar />
            <Heading fontSize="64px" lineHeight="64px" w="800px" margin="48px auto">
                Hello, {usernameCapitalized}
            </Heading>
            <SimpleGrid
                justifyItems="center"
                maxWidth="800px"
                margin="32px auto 0"
                gap="16px"
                columns={{ base: 1, md: 2 }}
            >
                <Box w="330px" h="200px">
                    <Text fontSize="2xl" fontWeight="bold" mb="8px">
                        Quick Actions
                    </Text>
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
                                handleCreate();
                            }}
                        >
                            New Session
                        </Button>
                        <Button
                            bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                            fontWeight="bold"
                            fontSize="md"
                            boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                            w="100%"
                            _hover={{ transform: "scale(1.05)" }}
                            transition="transform 0.2s"
                            onClick={() => navigate("/climbs")}
                        >
                            Add Climb
                        </Button>
                        <Button
                            bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                            fontWeight="bold"
                            fontSize="md"
                            boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                            w="100%"
                            _hover={{ transform: "scale(1.05)" }}
                            transition="transform 0.2s"
                            onClick={() => navigate("/sessions")}
                        >
                            View Sessions
                        </Button>
                    </VStack>
                </Box>
                <Box>
                    <Text fontSize="2xl" fontWeight="bold" mb="8px">
                        Climbs from previous Sessions
                    </Text>
                    {sessions.length != 0 ? (
                        <GraphPlaceholder data={sessions} />
                    ) : (
                        <Text>No sessions yet...</Text>
                    )}
                </Box>
                <Box w="330px">
                    <Text fontSize="2xl" fontWeight="bold" mb="8px">
                        {sessions.length != 0 ? "Latest Session" : "Start a Session"}
                    </Text>
                    {sessions.length != 0 ? (
                        <SessionCard
                            session={sessions[0]}
                            onClick={() => {
                                navigate(`/sessions/${sessions[0].id}`);
                            }}
                        />
                    ) : (
                        <AddSessionCard onClick={handleCreate} />
                    )}
                </Box>
            </SimpleGrid>
        </>
    );
}
