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
            size="lg"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content boxShadow="0px 3px 5px 0px rgba(135,93,61,0.45)">
                        <Dialog.Header>
                            <Dialog.Title fontSize="2xl">
                                {climb ? "Edit Climb" : "Add Climb"}
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Field.Root mb="8px">
                                <Field.Label fontSize="lg" fontWeight="bold">
                                    Name
                                </Field.Label>
                                <Input
                                    fontSize="md"
                                    border="none"
                                    bg="#ffffff"
                                    boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                                    placeholder="Green Overhang"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Field.Root>
                            <Field.Root mb="8px">
                                <Field.Label fontSize="lg" fontWeight="bold">
                                    Grade
                                </Field.Label>
                                <SegmentGroup.Root
                                    w="100%"
                                    defaultValue={grade.toUpperCase()}
                                    onValueChange={(val) => setGrade(val.value)}
                                    value={grade.toUpperCase()}
                                    border="none"
                                    boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                                >
                                    <SegmentGroup.Indicator />
                                    <SegmentGroup.Items
                                        w="100%"
                                        cursor="pointer"
                                        color="#482307"
                                        items={gradeOptions}
                                    />
                                </SegmentGroup.Root>
                            </Field.Root>
                            <ColorPicker.Root
                                defaultValue={parseColor(color)}
                                onValueChange={(val) => setColor(val.value.toString("hex"))}
                                mb="8px"
                            >
                                <ColorPicker.HiddenInput />
                                <ColorPicker.Label fontSize="lg" fontWeight="bold" color="#482307">
                                    Color
                                </ColorPicker.Label>
                                <ColorPicker.Control>
                                    <ColorPicker.Input boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)" />
                                    <ColorPicker.Trigger
                                        cursor="pointer"
                                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                                    />
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
                                bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                                fontWeight="bold"
                                fontSize="md"
                                boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                                onClick={handleSubmit}
                            >
                                {climb ? "Save" : "Add"}
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
