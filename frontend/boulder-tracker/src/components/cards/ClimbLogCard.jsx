import { Box, HStack, Text } from "@chakra-ui/react";
import { Sparkles, CircleCheckBig } from "lucide-react";

export default function ClimbLogCard({ log, onClick }) {
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

    const darkened = darkenColor(log.color, 15);

    const randomAngle = Math.round(Math.random() * 360);

    return (
        <Box
            onClick={onClick}
            cursor="pointer"
            w="330px"
            h="180px"
            bg="white"
            p="3px"
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s"
            borderRadius="xl"
            position="relative"
            boxShadow="0px 3px 5px 0px rgba(135,93,61,0.45)"
        >
            <Text pt="8px" ml="8px" fontSize="2xl">
                Name: {log.name}
            </Text>
            <Text ml="8px" fontSize="xl">
                Grade: {log.grade.toUpperCase()}
            </Text>
            <Text ml="8px" fontSize="xl">
                Attempts: {log.attempts}
            </Text>
            <HStack position="absolute" bottom="8px" left="8px">
                {log.topped ? (
                    <Box
                        bg="linear-gradient(180deg, #fffdf9ff 0%, #fff8e6 100%)"
                        borderRadius="md"
                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                    >
                        <HStack margin="6px 10px">
                            <CircleCheckBig size="18px" />
                            <Text fontSize="18px">Topped</Text>
                        </HStack>
                    </Box>
                ) : null}
                {log.flashed ? (
                    <Box
                        bg="linear-gradient(180deg, #fffdf9ff 0%, #fff8e6 100%)"
                        borderRadius="md"
                        boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                    >
                        <HStack margin="6px 10px">
                            <Sparkles size="18px" />
                            <Text fontSize="18px">Flashed</Text>
                        </HStack>
                    </Box>
                ) : null}
            </HStack>
            <Box
                position="absolute"
                h="60px"
                w="60px"
                right="8px"
                bottom="8px"
                borderRadius="xl"
                bg={`linear-gradient(175deg, ${log.color}, ${darkened})`}
            ></Box>
        </Box>
    );
}
