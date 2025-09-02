import { Box, Text } from "@chakra-ui/react";

export default function ClimbLogCard({ log, onClick }) {
    return (
        <Box onClick={onClick}>
            <Text>Name: {log.name}</Text>
            <Text>Grade: {log.grade.toUpperCase()}</Text>
            <Text>Attempts: {log.attempts}</Text>
        </Box>
    );
}
