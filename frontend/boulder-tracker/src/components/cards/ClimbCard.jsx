import { Box, Text } from "@chakra-ui/react";

export default function SessionCard({ climb, onClick }) {
    return (
        <Box onClick={onClick}>
            <Text>Name: {climb.name}</Text>
            <Text>Grade: {climb.grade.toUpperCase()}</Text>
        </Box>
    );
}
