import AddClimbCard from "../components/cards/AddClimbCard.jsx";
import ClimbCard from "../components/cards/ClimbCard.jsx";
import ClimbModal from "../components/modals/ClimbModal.jsx";
import { SimpleGrid } from "@chakra-ui/react";
import { apiFetchClimbs, apiCreateClimb, apiEditClimb } from "../api/api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VscLayoutPanelJustify } from "react-icons/vsc";

export default function ClimbsPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [climbs, setClimbs] = useState([]);
    const [modalState, setModalState] = useState(false);
    const [modalClimb, setModalClimb] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            const data = await apiFetchClimbs();
            if (!data.error) {
                setClimbs(data.climbs);
            }
        };
        fetch();
    }, [token]);

    async function handleCreateClimb(values) {
        const { name, grade, color, photo_url, climb_id } = values;
        if (climb_id) {
            const res = await apiEditClimb(name, grade, color, photo_url, climb_id);
            if (!res.error) {
                setModalState(false);
                const data = await apiFetchClimbs();
                if (!data.error) {
                    setClimbs(data.climbs);
                }
            }
        } else {
            const res = await apiCreateClimb(name, grade, color, photo_url);
            if (!res.error) {
                setClimbs((prev) => [...prev, res.climb]);
                setModalState(false);
            }
        }
    }

    return (
        <>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                <AddClimbCard
                    onClick={() => {
                        setModalState(true);
                    }}
                />
                {climbs.map((climb) => (
                    <ClimbCard
                        key={climb.id}
                        climb={climb}
                        onClick={() => {
                            setModalClimb(climb), setModalState(true);
                        }}
                    />
                ))}
            </SimpleGrid>
            <ClimbModal
                isOpen={modalState}
                onClose={() => {
                    setModalState(false), setModalClimb(null);
                }}
                onSubmit={handleCreateClimb}
                climb={modalClimb}
            />
        </>
    );
}
