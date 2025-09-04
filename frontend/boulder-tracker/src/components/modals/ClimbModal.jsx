import {
    Dialog,
    Field,
    Portal,
    Button,
    Input,
    SegmentGroup,
    ColorPicker,
    HStack,
    parseColor,
    ColorPickerChannelSlider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ClimbModal({ isOpen, onClose, onSubmit, climb, onDelete }) {
    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [color, setColor] = useState("#ffffff");
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const climb_id = climb ? climb.id : null;
    const gradeOptions = Array.from({ length: 10 }, (_, i) => `V${i}`);
    useEffect(() => {
        setDeleteConfirm(false);
        setDisabled(false);
        if (climb) {
            setName(climb.name || "");
            setGrade(climb.grade || "");
            setColor(climb.color || "#ffffff");
        } else {
            setName("");
            setGrade("");
            setColor("#ffffff");
        }
    }, [climb, isOpen]);

    function handleSubmit() {
        onSubmit({ name, grade, color, climb_id });
    }

    function handleDelete() {
        if (deleteConfirm) {
            climb ? onDelete(climb_id) : null;
        } else {
            setDisabled(true);
            toast(
                "Are you you want to delete this climb? \n (This will delete all logs associated)"
            );
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
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{climb ? "Edit Climb" : "Add Climb"}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Field.Root>
                                <Field.Label>Name</Field.Label>
                                <Input
                                    placeholder="Green Overhang"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Grade</Field.Label>
                                <SegmentGroup.Root
                                    defaultValue={grade.toUpperCase()}
                                    onValueChange={(val) => setGrade(val.value)}
                                    value={grade.toUpperCase()}
                                >
                                    <SegmentGroup.Indicator />
                                    <SegmentGroup.Items items={gradeOptions} />
                                </SegmentGroup.Root>
                            </Field.Root>
                            <ColorPicker.Root
                                defaultValue={parseColor(color)}
                                onValueChange={(val) => setColor(val.value.toString("hex"))}
                            >
                                <ColorPicker.HiddenInput />
                                <ColorPicker.Label>Color</ColorPicker.Label>
                                <ColorPicker.Control>
                                    <ColorPicker.Input />
                                    <ColorPicker.Trigger />
                                </ColorPicker.Control>

                                <ColorPicker.Positioner>
                                    <ColorPicker.Content>
                                        <ColorPicker.Area />
                                        <HStack>
                                            <ColorPickerChannelSlider channel="hue" />
                                        </HStack>
                                    </ColorPicker.Content>
                                </ColorPicker.Positioner>
                            </ColorPicker.Root>
                        </Dialog.Body>

                        <Dialog.Footer>
                            {climb ? (
                                <Button onClick={handleDelete} disabled={disabled}>
                                    Delete
                                </Button>
                            ) : null}
                            <Dialog.ActionTrigger asChild>
                                <Button>Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button onClick={handleSubmit}>{climb ? "Save" : "Add"}</Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
