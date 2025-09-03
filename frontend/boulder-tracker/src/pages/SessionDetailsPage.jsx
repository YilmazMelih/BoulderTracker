import AddLogCard from "../components/cards/AddLogCard.jsx";
import ClimbLogCard from "../components/cards/ClimbLogCard.jsx";
import { SimpleGrid } from "@chakra-ui/react";
import { apiFetchSessionDet, apiCreateLog } from "../api/api.js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function SessionDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [logs, setLogs] = useState([]);
    console.log(logs);
    useEffect(() => {
        const fetch = async () => {
            const data = await apiFetchSessionDet(id);
            if (!data.error) {
                setLogs(data.logs);
            } else {
                toast.error(data.error);
            }
        };
        fetch();
    }, [token]);
    const test = [];
    logs.map((log) => {
        console.log(log);
    });

    // async function handleCreate() {
    //     const res = await apiCreateSession();
    //     if (!res.error) {
    //         console.log(res);
    //         navigate(`/sessions/${res.session.id}`);
    //     }
    // }

    return (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            <AddLogCard onClick={() => {}} />
            {logs.map((log) => (
                <ClimbLogCard key={log.id} log={log} />
            ))}
        </SimpleGrid>
    );
}
