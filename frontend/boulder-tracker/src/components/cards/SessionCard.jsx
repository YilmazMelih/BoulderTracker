import { Box, Text } from "@chakra-ui/react";

export default function SessionCard({ session, onClick }) {
    const randomAngle = Math.floor(Math.random() * 360);
    return (
        <Box
            onClick={onClick}
            cursor="pointer"
            w="330px"
            h="180px"
            _hover={{ transform: "scale(1.05)" }}
            transition="transform 0.2s"
            borderRadius="xl"
            bg="white"
            boxShadow="0px 3px 5px 0px rgba(135,93,61,0.45)"
        >
            <Text pt="8px" ml="8px" fontSize="2xl">
                Session on: {session.date.slice(0, 10)}
            </Text>
        </Box>
    );
}
