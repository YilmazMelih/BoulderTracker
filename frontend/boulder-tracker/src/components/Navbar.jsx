import { HStack, Link, Spacer } from "@chakra-ui/react";
import { Mountain } from "lucide-react";

export default function Navbar() {
    return (
        <HStack
            as="nav"
            w="100%"
            h="60px"
            bg="linear-gradient(180deg, #fffdf9ff 0%, #fff8e6 100%)"
            boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
        >
            <Link href="/" fontSize="2xl" ml="16px" color="#482307" fontWeight={"bold"}>
                <Mountain /> BoulderTracker
            </Link>
            <Spacer />
            <HStack as="ul" listStyleType="none" mr="16px">
                <li>
                    <Link href="/sessions" color="#482307" fontWeight={"bold"}>
                        Sessions
                    </Link>
                </li>
                <li>
                    <Link href="/climbs" color="#482307" fontWeight={"bold"}>
                        Climbs
                    </Link>
                </li>
                <li>
                    <Link href="/profile" color="#482307" fontWeight={"bold"}>
                        Profile
                    </Link>
                </li>
            </HStack>
        </HStack>
    );
}
