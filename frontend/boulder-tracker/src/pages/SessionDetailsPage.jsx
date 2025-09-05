import AddLogCard from "../components/cards/AddLogCard.jsx";
import ClimbLogCard from "../components/cards/ClimbLogCard.jsx";
import AddLogModal from "../components/modals/AddLogModal.jsx";
import Navbar from "../components/Navbar.jsx";
import SelectClimbModal from "../components/modals/SelectClimbModal.jsx";
import { SimpleGrid, Button } from "@chakra-ui/react";
import {
    apiFetchSessionDet,
    apiCreateLog,
    apiEditLog,
    apiDeleteLog,
    apiDeleteSesh,
    checkTokenExpired,
} from "../api/api.js";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { recordStats } from "framer-motion";

export default function SessionDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [logs, setLogs] = useState([]);
    const [selectClimbOpen, setSelectClimbOpen] = useState(false);
    const [selectLogModalOpen, setSelectLogModalOpen] = useState(false);
    const [selectedClimb, setSelectedClimb] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const fetch = async () => {
        if (checkTokenExpired()) {
            navigate("/login");
        }
        const data = await apiFetchSessionDet(id);
        if (!data.error) {
            setLogs(data.logs);
        } else {
            toast.error(data.error);
        }
    };

    useEffect(() => {
        fetch();
    }, [token]);

    function handleSelectClimb(climb) {
        setSelectedClimb(climb);
        setSelectClimbOpen(false);
        setSelectLogModalOpen(true);
    }

    function onChangeClimb() {
        setSelectLogModalOpen(false);
        setSelectClimbOpen(true);
    }

    async function handleSubmit(values) {
        const { attempts, topped, flashed, climb_id, log_id } = values;
        if (log_id) {
            const res = await apiEditLog(id, log_id, attempts, flashed, topped);
            if (!res.error) {
                setSelectLogModalOpen(false);
                fetch();
            } else {
                toast.error(res.error);
            }
        } else {
            const res = await apiCreateLog(id, climb_id, attempts, flashed, topped);
            if (!res.error) {
                fetch();
                setSelectLogModalOpen(false);
            } else {
                toast.error(res.error);
            }
        }
        setSelectedClimb(null);
        setSelectedLog(null);
    }

    async function handleDelete(log_id) {
        const res = await apiDeleteLog(id, log_id);
        if (!res.error) {
            fetch();
            setSelectLogModalOpen(false);
        } else {
            toast.error(res.error);
        }
        setSelectedClimb(null);
        setSelectedLog(null);
    }

    async function handleSeshDelete() {
        if (deleteConfirm) {
            const res = await apiDeleteSesh(id);
            if (!res.error) {
                navigate("/sessions");
            } else {
                toast.error(res.error);
            }
        } else {
            setDisabled(true);
            toast("Are you you want to delete this session?");
            setTimeout(() => {
                setDisabled(false);
                setDeleteConfirm(true);
            }, 3000);
        }
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
                <AddLogCard
                    onClick={() => {
                        setSelectClimbOpen(true);
                    }}
                />
                {logs.map((log) => (
                    <ClimbLogCard
                        key={log.id}
                        log={log}
                        onClick={() => {
                            setSelectedClimb({ id: log.climb_id, name: log.name });
                            setSelectedLog(log);
                            setSelectClimbOpen(null);
                            setSelectLogModalOpen(true);
                        }}
                    />
                ))}
            </SimpleGrid>
            <Button
                position="fixed"
                bottom="32px"
                right="32px"
                bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                fontWeight="bold"
                fontSize="md"
                boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                w="100px"
                h="40px"
                _hover={{ transform: "scale(1.05)" }}
                transition="transform 0.2s"
                disabled={disabled}
                onClick={handleSeshDelete}
            >
                Delete
            </Button>
            <Button
                position="fixed"
                bottom="32px"
                left="32px"
                bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                fontWeight="bold"
                fontSize="md"
                boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                w="100px"
                h="40px"
                _hover={{ transform: "scale(1.05)" }}
                transition="transform 0.2s"
                onClick={() => {
                    navigate("/sessions");
                }}
            >
                Back
            </Button>
            <SelectClimbModal
                isOpen={selectClimbOpen}
                onClose={() => setSelectClimbOpen(false)}
                onSelectClimb={handleSelectClimb}
            />
            <AddLogModal
                isOpen={selectLogModalOpen}
                onClose={() => {
                    setSelectLogModalOpen(false);
                    setSelectedClimb(null);
                    setSelectedLog(null);
                }}
                climb={selectedClimb}
                onChangeClimb={onChangeClimb}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                existingLog={selectedLog}
            />
        </>
    );
}
