import AddSessionCard from "../components/cards/AddSessionCard.jsx";
import SessionCard from "../components/cards/SessionCard.jsx";
import { SimpleGrid } from "@chakra-ui/react";
import { apiFetchSessions, apiCreateSession, checkTokenExpired } from "../api/api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SessionsPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [sessions, setSessions] = useState([]);

    if (checkTokenExpired()) {
        navigate("/login");
    }

    useEffect(() => {
        const fetch = async () => {
            const data = await apiFetchSessions();
            if (!data.error) {
                setSessions(data.sessions);
            } else {
                toast.error(data.error);
            }
        };
        fetch();
    }, [token]);

    async function handleCreate() {
        const res = await apiCreateSession();
        if (!res.error) {
            console.log(res);
            navigate(`/sessions/${res.session.id}`);
        } else {
            toast.error(res.error);
        }
    }

    return (
        <SimpleGrid
            justifyItems="center"
            maxWidth="1200px"
            margin="32px auto 0"
            gap="16px"
            columns={{ base: 1, md: 2, lg: 3 }}
        >
            <AddSessionCard onClick={handleCreate} />
            {sessions.map((session) => (
                <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => navigate(`/sessions/${session.id}`)}
                />
            ))}
        </SimpleGrid>
    );
}
