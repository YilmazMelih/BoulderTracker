import { SimpleGrid, Dialog, Portal } from "@chakra-ui/react";
import AddClimbCard from "../cards/AddClimbCard.jsx";
import ClimbCard from "../cards/ClimbCard.jsx";
import ClimbModal from "../modals/ClimbModal.jsx";
import { apiFetchClimbs, apiCreateClimb, apiEditClimb } from "../../api/api.js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function SelectClimbModal({ isOpen, onClose, onSelectClimb }) {
    const [climbs, setClimbs] = useState([]);
    const [modalState, setModalState] = useState(false);
    const [modalClimb, setModalClimb] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetch = async () => {
            const data = await apiFetchClimbs();
            if (!data.error) setClimbs(data.climbs);
            else toast.error(data.error);
        };
        fetch();
    }, [isOpen]);

    async function handleCreateClimb(values) {
        const { name, grade, color, photo_url, climb_id } = values;

        if (climb_id) {
            const res = await apiEditClimb(name, grade, color, photo_url, climb_id);
            if (!res.error) {
                setModalState(false);
                const data = await apiFetchClimbs();
                if (!data.error) setClimbs(data.climbs);
                else toast.error(data.error);
            } else toast.error(res.error);
        } else {
            const res = await apiCreateClimb(name, grade, color, photo_url);
            if (!res.error) {
                onSelectClimb(res.climb);
            } else toast.error(res.error);
        }
    }

    function handleSelect(climb) {
        onSelectClimb(climb);
    }

    return (
        <Dialog.Root size="cover" open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                            <AddClimbCard onClick={() => setModalState(true)} />
                            {climbs.map((climb) => (
                                <ClimbCard
                                    key={climb.id}
                                    climb={climb}
                                    onClick={() => handleSelect(climb)}
                                />
                            ))}
                        </SimpleGrid>

                        <ClimbModal
                            isOpen={modalState}
                            onClose={() => setModalState(false)}
                            onSubmit={handleCreateClimb}
                            climb={modalClimb}
                        />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
