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
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{existingLog ? "Edit Log" : "Add Log"}</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Field.Root>
                                <Field.Label>Climb</Field.Label>
                                <HStack>
                                    <Input
                                        value={selectedClimb ? selectedClimb.name : ""}
                                        readOnly
                                        disabled
                                        cursor={"default"}
                                        placeholder="Select a climb"
                                    />
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            onChangeClimb();
                                        }}
                                    >
                                        Change
                                    </Button>
                                </HStack>
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Attempts</Field.Label>
                                <NumberInput.Root
                                    defaultValue={attempts}
                                    onValueChange={(val) => setAttempts(val.valueAsNumber)}
                                    min={0}
                                >
                                    <NumberInput.Control />
                                    <NumberInput.Input />
                                </NumberInput.Root>
                            </Field.Root>

                            <HStack>
                                <CheckboxCard.Root
                                    defaultChecked={flashed}
                                    onChange={() => setFlashed(!flashed)}
                                >
                                    <CheckboxCard.HiddenInput />
                                    <CheckboxCard.Control>
                                        <CheckboxCard.Label>Flashed</CheckboxCard.Label>
                                        <CheckboxCard.Indicator />
                                    </CheckboxCard.Control>
                                </CheckboxCard.Root>

                                <CheckboxCard.Root
                                    defaultChecked={topped}
                                    onChange={() => setTopped(!topped)}
                                >
                                    <CheckboxCard.HiddenInput />
                                    <CheckboxCard.Control>
                                        <CheckboxCard.Label>Topped</CheckboxCard.Label>
                                        <CheckboxCard.Indicator />
                                    </CheckboxCard.Control>
                                </CheckboxCard.Root>
                            </HStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            {existingLog ? (
                                <Button onClick={handleDelete} disabled={disabled}>
                                    Delete
                                </Button>
                            ) : null}
                            <Dialog.ActionTrigger asChild>
                                <Button>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button onClick={handleSubmit}>{existingLog ? "Save" : "Add"}</Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
