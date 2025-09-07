import {
    Heading,
    Box,
    Button,
    Text,
    VStack,
    SimpleGrid,
    HStack,
    Link,
    Spacer,
} from "@chakra-ui/react";
import { Mountain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddSessionCard from "../components/cards/AddSessionCard";
import ClimbCard from "../components/cards/ClimbCard";
import ClimbLogCard from "../components/cards/ClimbLogCard";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <>
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
                        <Button
                            bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                            fontWeight="bold"
                            fontSize="md"
                            display={{ base: "none", sm: "block" }}
                            w={"100px"}
                            boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                            _hover={{ transform: "scale(1.05)" }}
                            transition="transform 0.2s"
                            onClick={() => {
                                navigate("/signup");
                            }}
                        >
                            Sign Up
                        </Button>
                    </li>
                    <li>
                        <Button
                            bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                            fontWeight="bold"
                            fontSize="md"
                            display={{ base: "none", sm: "block" }}
                            w="100px"
                            boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                            _hover={{ transform: "scale(1.05)" }}
                            transition="transform 0.2s"
                            onClick={() => {
                                navigate("/login");
                            }}
                        >
                            Log In
                        </Button>
                    </li>
                </HStack>
            </HStack>
            <Box mb="200px">
                <HStack>
                    <Heading
                        fontSize={{ base: "40px", sm: "60px" }}
                        lineHeight={{ base: "40px", sm: "60px" }}
                        margin="25vh auto 12px"
                        textAlign="center"
                        display="flex"
                    >
                        <Box w={{ base: "36px", sm: "56px" }}>
                            <Mountain size={"100%"} />
                        </Box>
                        BoulderTracker
                    </Heading>
                </HStack>
                <Heading
                    color="#a1724e"
                    margin="0 auto"
                    textAlign="center"
                    fontSize={{ base: "xl", sm: "2xl" }}
                >
                    Easily track bouldering progress!
                </Heading>
                <Button
                    display={"block"}
                    bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                    fontWeight="bold"
                    fontSize="md"
                    boxShadow="0px 2px 5px 0px #875d3d73"
                    w="200px"
                    margin={"12px auto"}
                    _hover={{ transform: "scale(1.05)" }}
                    transition="transform 0.2s"
                    onClick={() => {
                        navigate("/signup");
                    }}
                >
                    Get Started
                </Button>
            </Box>
            <SimpleGrid
                data-aos="fade-up"
                padding={"50px"}
                maxW={{ base: "360px", sm: "500px", md: "700px" }}
                borderRadius="xl"
                bg="linear-gradient( #f5efddff 0%, #f0ead8ff 100%)"
                boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                w="100%"
                margin="0 auto"
                columns={{ base: 1, md: 2 }}
                mb="200px"
                gapY={"12px"}
                justifyItems="center"
            >
                <Text
                    fontSize="5xl"
                    pt="24px"
                    pl={{ base: "0", md: "20px" }}
                    lineHeight={"60px"}
                    textAlign={{ base: "center", md: "left" }}
                >
                    Start a session!
                </Text>
                <AddSessionCard onClick={() => {}} />
            </SimpleGrid>
            <SimpleGrid
                data-aos="fade-up"
                padding="50px"
                bg="linear-gradient( #f2ebd6ff 0%, #ece6d2ff 100%)"
                boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                borderRadius="xl"
                maxW={{ base: "360px", sm: "500px", md: "700px" }}
                w="100%"
                margin="0 auto"
                columns={{ base: 1, md: 2 }}
                mb="200px"
                gapY={"12px"}
                justifyItems="center"
            >
                <ClimbCard
                    onClick={() => {}}
                    climb={{ name: "Green Overhang", grade: "v5", color: "#16c916" }}
                />
                <Text
                    fontSize="5xl"
                    pt="24px"
                    pl={{ base: "0", md: "20px" }}
                    lineHeight={"60px"}
                    textAlign={{ base: "center", md: "right" }}
                >
                    Add your climbs!
                </Text>
            </SimpleGrid>
            <SimpleGrid
                padding={"50px"}
                maxW={{ base: "360px", sm: "500px", md: "700px" }}
                borderRadius="xl"
                bg="linear-gradient( #ede5cfff 0%, #e4dec7ff 100%)"
                boxShadow="0px 2px 5px 0px rgba(135,93,61,0.45)"
                w="100%"
                margin="0 auto"
                columns={{ base: 1, md: 2 }}
                mb="64px"
                gapY={"12px"}
                justifyItems="center"
            >
                <Text
                    fontSize="5xl"
                    pt="24px"
                    pl={{ base: "0", md: "20px" }}
                    lineHeight={"60px"}
                    textAlign={{ base: "center", md: "left" }}
                >
                    Log your attempts!
                </Text>
                <ClimbLogCard
                    onClick={() => {}}
                    log={{
                        name: "Crimpy Slab",
                        grade: "v3",
                        topped: "true",
                        flashed: "true",
                        attempts: "1",
                        color: "#1b26eaff",
                    }}
                />
            </SimpleGrid>
            <Button
                display={"block"}
                bg="linear-gradient(180deg, #764d2fff 0%, #56341cff 100%)"
                fontWeight="bold"
                fontSize="xl"
                boxShadow="0px 2px 5px 0px #875d3d73"
                h="60px"
                w="300px"
                margin={"64px auto"}
                _hover={{ transform: "scale(1.05)" }}
                transition="transform 0.2s"
                onClick={() => {
                    navigate("/signup");
                }}
            >
                Get Started
            </Button>
        </>
    );
}
