import { Box, Text } from "@chakra-ui/react";

export default function AddSessionCard({ onClick }) {
    return (
        <Box onClick={onClick}>
            <Text>+ Add New Session</Text>
        </Box>
    );
}
