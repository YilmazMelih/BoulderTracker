import { Box, Text } from "@chakra-ui/react";

export default function AddClimbCard({ onClick }) {
    return (
        <Box onClick={onClick}>
            <Text>+ Add New Climb</Text>
        </Box>
    );
}
