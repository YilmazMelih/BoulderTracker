"use client";

import { ChakraProvider, defaultSystem, defaultConfig, createSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./color-mode";

const customConfig = {
    ...defaultConfig,
    theme: {
        ...defaultConfig.theme,
        tokens: {
            ...defaultConfig.theme.tokens,
            fonts: {
                ...defaultConfig.theme.tokens.fonts,
                body: "Sansation, sans-serif",
                heading: "Sansation, sans-serif",
            },
        },
    },
};

const customSystem = createSystem(customConfig);

export function Provider(props) {
    return (
        <ChakraProvider value={customSystem}>
            <ColorModeProvider forcedTheme="light" {...props} />
        </ChakraProvider>
    );
}
