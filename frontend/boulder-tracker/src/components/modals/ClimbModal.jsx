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

export default function ClimbModal({ isOpen, onClose, onSubmit, climb }) {
    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [color, setColor] = useState("#ffffff");

    const climb_id = climb ? climb.id : null;
    const gradeOptions = Array.from({ length: 10 }, (_, i) => `V${i}`);
    useEffect(() => {
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
