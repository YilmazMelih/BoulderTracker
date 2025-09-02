import AddClimbCard from "../components/cards/AddClimbCard.jsx";
import ClimbCard from "../components/cards/ClimbCard.jsx";
import { SimpleGrid } from "@chakra-ui/react";
import { apiFetchClimbs, apiCreateClimb } from "../api/api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SessionsPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [climbs, setClimbs] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await apiFetchClimbs();
            if (!data.error) {
                setClimbs(data.climbs);
            }
        };
        fetch();
    }, [token]);

    // async function handleCreate() {
    //     const res = await apiCreateClimb();
    //     if (!res.error) {
    //         console.log(res);
    //         navigate(`/sessions/${res.session.id}`);
    //     }
    // }

    return (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            <AddClimbCard onClick={() => {}} />
            {climbs.map((climb) => (
                <ClimbCard key={climb.id} climb={climb} />
            ))}
        </SimpleGrid>
    );
}
