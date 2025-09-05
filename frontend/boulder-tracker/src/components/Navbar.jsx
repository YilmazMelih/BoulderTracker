import { HStack, Link, Spacer } from "@chakra-ui/react";
import { Mountain } from "lucide-react";

export default function Navbar() {
    return (
        <HStack
            as="nav"
            w="100%"
            h="60px"
            bg="linear-gradient(180deg, #fffdf9ff 0%, #fff8e6 100%)"
            // borderRadius="md"
            boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
        >
            <Link href="/" fontSize="2xl" ml="16px">
                <Mountain /> BoulderTracker
            </Link>
            <Spacer />
            <HStack as="ul" listStyleType="none" mr="16px">
                <li>
                    <Link href="/sessions">Sessions</Link>
                </li>
                <li>
                    <Link href="/climbs">Climbs</Link>
                </li>
                <li>
                    <Link href="/profile">Profile</Link>
                </li>
            </HStack>
        </HStack>
    );
}
