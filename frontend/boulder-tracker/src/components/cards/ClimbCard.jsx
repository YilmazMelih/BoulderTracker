import { Box, Text } from "@chakra-ui/react";

export default function SessionCard({ climb, onClick }) {
    const darkenColor = (color, percent) => {
        const hex = color.replace("#", "");

        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const factor = (100 - percent) / 100;
        const newR = Math.round(r * factor);
        const newG = Math.round(g * factor);
        const newB = Math.round(b * factor);
        return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB
            .toString(16)
            .padStart(2, "0")}`;
    };

    const darkened = darkenColor(climb.color, 15);

    const randomAngle = Math.round(Math.random() * 360);
    return (
        <Box
            onClick={onClick}
            cursor="pointer"
            w="330px"
            h="180px"
            boxShadow="0px 3px 5px 0px rgba(135,93,61,0.45)"
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s"
            borderRadius="xl"
            bg="white"
            position="relative"
        >
            <Text pt="8px" ml="8px" fontSize="2xl">
                Name: {climb.name}
            </Text>
            <Text ml="8px" fontSize="xl">
                Grade: {climb.grade.toUpperCase()}
            </Text>
            <Box
                position="absolute"
                h="60px"
                w="60px"
                right="8px"
                bottom="8px"
                borderRadius="xl"
                bg={`linear-gradient(175deg, ${climb.color}, ${darkened})`}
            ></Box>
        </Box>
    );
}
