import { Box, Text, AbsoluteCenter } from "@chakra-ui/react";
import { Plus } from "lucide-react";

export default function AddSessionCard({ onClick }) {
    return (
        <Box
            onClick={onClick}
            cursor="pointer"
            w="330px"
            h="180px"
            _hover={{ transform: "scale(1.05)" }}
            boxShadow="0px 3px 5px 0px rgba(135,93,61,0.45)"
            transition="transform 0.2s"
            borderRadius="xl"
            bg="white"
            position="relative"
        >
            <Text pt="8px" ml="8px" fontSize="2xl" color="rgba(72, 35, 7, 0.45)">
                Session on: ?
            </Text>
            <Text ml="8px" fontSize="xl" color="rgba(72, 35, 7, 0.45)">
                # Climbs
            </Text>
            <Text ml="8px" fontSize="xl" color="rgba(72, 35, 7, 0.45)">
                # Tops
            </Text>
            <AbsoluteCenter
                h="80px"
                w="80px"
                bg="linear-gradient(145deg, #764d2fff 0%, #56341cff 100%)"
                borderRadius="lg"
            >
                <Plus size="64px" color="white" />
            </AbsoluteCenter>
        </Box>
    );
}
