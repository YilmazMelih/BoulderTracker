import {
    Dialog,
    Portal,
    Button,
    Input,
    NumberInput,
    CheckboxCard,
    HStack,
    Field,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddLogModal({
    isOpen,
    onClose,
    onSubmit,
    climb,
    onChangeClimb,
    onDelete,
    existingLog = null,
}) {
    const [selectedClimb, setSelectedClimb] = useState(climb || null);
    const [attempts, setAttempts] = useState(existingLog ? existingLog.attempts : 0);
    const [flashed, setFlashed] = useState(existingLog ? existingLog.flashed : false);
    const [topped, setTopped] = useState(existingLog ? existingLog.topped : false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [disabled, setDisabled] = useState(false);
    useEffect(() => {
        setSelectedClimb(climb || null);
        setDeleteConfirm(false);
        setDisabled(false);
        setAttempts(existingLog ? existingLog.attempts : 0);
        setFlashed(existingLog ? (existingLog.flashed ? true : false) : false);
        setTopped(existingLog ? (existingLog.topped ? true : false) : false);
    }, [climb, existingLog, isOpen]);

    function handleSubmit() {
        if (!selectedClimb) return;

        onSubmit({
            climb_id: selectedClimb.id,
            attempts,
            flashed,
            topped: topped ? true : false,
            log_id: existingLog ? existingLog.id : null,
        });
    }

    function handleDelete() {
        if (deleteConfirm) {
            existingLog ? onDelete(existingLog.id) : null;
        } else {
            setDisabled(true);
            toast("Are you you want to delete this log?");
            setTimeout(() => {
                setDisabled(false);
                setDeleteConfirm(true);
            }, 3000);
        }
    }

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open) onClose();
            }}
        >
            <Portal>
                <Dialog.Positioner>
                    <Dialog.Backdrop />

                    <Dialog.Content boxShadow="0px 3px 5px 0px rgba(135,93,61,0.45)">
                        <Dialog.Header>
                            <Dialog.Title fontSize="2xl">
                                {existingLog ? "Edit Log" : "Add Log"}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Field.Root mb="8px">
                                <Field.Label fontSize="lg" fontWeight="bold">
                                    Climb
                                </Field.Label>
                                <HStack w="100%">
                                    <Input
                                        value={selectedClimb ? selectedClimb.name : ""}
                                        readOnly
                                        w="100%"
                                        disabled
                                        cursor={"default"}
                                        fontSize="md"
                                        border="none"
                                        bg="#ffffff"
                                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                                        placeholder="Select a climb"
                                    />
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            onChangeClimb();
                                        }}
                                        bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                                        fontWeight="bold"
                                        fontSize="md"
                                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                                    >
                                        Change
                                    </Button>
                                </HStack>
                            </Field.Root>

                            <Field.Root mb="16px" w="100%">
                                <Field.Label fontSize="lg" fontWeight="bold">
                                    Attempts
                                </Field.Label>
                                <NumberInput.Root
                                    w="100%"
                                    defaultValue={attempts}
                                    onValueChange={(val) => setAttempts(val.valueAsNumber)}
                                    min={0}
                                >
                                    <NumberInput.Control w="90px" />
                                    <NumberInput.Input
                                        w="100%"
                                        border="none"
                                        fontSize="md"
                                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                                    />
                                </NumberInput.Root>
                            </Field.Root>

                            <HStack>
                                <CheckboxCard.Root
                                    defaultChecked={flashed}
                                    onChange={() => setFlashed(!flashed)}
                                    _checked={{
                                        border: "1px solid #482307",
                                        boxShadow: "0px 0px 0px 1px #482307",
                                    }}
                                    cursor="pointer"
                                >
                                    <CheckboxCard.HiddenInput />
                                    <CheckboxCard.Control>
                                        <CheckboxCard.Label fontSize="lg" fontWeight="bold">
                                            Flashed
                                        </CheckboxCard.Label>
                                        <CheckboxCard.Indicator
                                            _checked={{ bg: "#482307", border: "#482307" }}
                                        />
                                    </CheckboxCard.Control>
                                </CheckboxCard.Root>

                                <CheckboxCard.Root
                                    defaultChecked={topped}
                                    onChange={() => setTopped(!topped)}
                                    _checked={{
                                        border: "1px solid #482307",
                                        boxShadow: "0px 0px 0px 1px #482307",
                                    }}
                                    cursor="pointer"
                                >
                                    <CheckboxCard.HiddenInput />
                                    <CheckboxCard.Control>
                                        <CheckboxCard.Label fontSize="lg" fontWeight="bold">
                                            Topped
                                        </CheckboxCard.Label>
                                        <CheckboxCard.Indicator
                                            _checked={{ bg: "#482307", border: "#482307" }}
                                        />
                                    </CheckboxCard.Control>
                                </CheckboxCard.Root>
                            </HStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            {existingLog ? (
                                <Button
                                    onClick={handleDelete}
                                    disabled={disabled}
                                    bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                                    fontWeight="bold"
                                    fontSize="md"
                                    boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                                >
                                    Delete
                                </Button>
                            ) : null}
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                                    fontWeight="bold"
                                    fontSize="md"
                                    boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                                >
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                onClick={handleSubmit}
                                bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                                fontWeight="bold"
                                fontSize="md"
                                boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                            >
                                {existingLog ? "Save" : "Add"}
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
