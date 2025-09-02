import { Box, Text } from "@chakra-ui/react";

export default function SessionCard({ session, onClick }) {
    return (
        <Box onClick={onClick}>
            <Text>Session on: {session.date.slice(0, 10)}</Text>
        </Box>
    );
}
