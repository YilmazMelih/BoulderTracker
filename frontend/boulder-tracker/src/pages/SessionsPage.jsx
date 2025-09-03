import AddSessionCard from "../components/cards/AddSessionCard.jsx";
import SessionCard from "../components/cards/SessionCard.jsx";
import { SimpleGrid } from "@chakra-ui/react";
import { apiFetchSessions, apiCreateSession } from "../api/api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SessionsPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [sessions, setSessions] = useState([]);

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
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
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
