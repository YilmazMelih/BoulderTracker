import { Box, Text } from "@chakra-ui/react";

export default function AddLogCard({ onClick }) {
    return (
        <Box onClick={onClick}>
            <Text>+ Add New Log</Text>
        </Box>
    );
}
