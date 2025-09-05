import AddClimbCard from "../components/cards/AddClimbCard.jsx";
import ClimbCard from "../components/cards/ClimbCard.jsx";
import ClimbModal from "../components/modals/ClimbModal.jsx";
import Navbar from "../components/Navbar.jsx";
import { SimpleGrid } from "@chakra-ui/react";
import {
    apiFetchClimbs,
    apiCreateClimb,
    apiEditClimb,
    apiDeleteClimb,
    checkTokenExpired,
} from "../api/api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ClimbsPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [climbs, setClimbs] = useState([]);
    const [modalState, setModalState] = useState(false);
    const [modalClimb, setModalClimb] = useState(null);

    if (checkTokenExpired()) {
        navigate("/login");
    }

    const fetch = async () => {
        const data = await apiFetchClimbs();
        if (!data.error) {
            setClimbs(data.climbs);
        } else {
            toast.error(data.error);
        }
    };

    useEffect(() => {
        fetch();
    }, [token]);

    async function handleSubmit(values) {
        const { name, grade, color, photo_url, climb_id } = values;
        if (climb_id) {
            const res = await apiEditClimb(name, grade, color, photo_url, climb_id);
            if (!res.error) {
                setModalState(false);
                const data = await apiFetchClimbs();
                if (!data.error) {
                    setClimbs(data.climbs);
                } else {
                    toast.error(data.error);
                }
            } else {
                toast.error(res.error);
            }
        } else {
            const res = await apiCreateClimb(name, grade, color, photo_url);
            if (!res.error) {
                setClimbs((prev) => [...prev, res.climb]);
                setModalState(false);
            } else {
                toast.error(res.error);
            }
        }
        setModalClimb(null);
    }

    async function handleDelete(climb_id) {
        const res = await apiDeleteClimb(climb_id);
        if (!res.error) {
            fetch();
            setModalState(false);
        } else {
            toast.error(res.error);
        }
        setModalClimb(null);
    }

    return (
        <>
            <Navbar />
            <SimpleGrid
                justifyItems="center"
                maxWidth="1200px"
                margin="32px auto 0"
                gap="16px"
                columns={{ base: 1, md: 2, lg: 3 }}
            >
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
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                climb={modalClimb}
            />
        </>
    );
}
