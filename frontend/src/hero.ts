import { heroui } from "@heroui/theme";

const plugin = heroui({
    defaultTheme: "light",
    themes: {
        light: {
            colors: {
                primary: {
                    50: "#DEF7F6",
                    100: "#CBF3F0",
                    200: "#AEECE7",
                    300: "#49D4C6",
                    400: "#39D0C1",
                    500: "#2EC4B6",
                    600: "#2BB6A8",
                    700: "#27A599",
                    800: "#239589",
                    900: "#1F847A",
                    DEFAULT: "#2EC4B6",
                    foreground: "#FFFFFF",
                },
                secondary: {
                    50: "#FFDCAD",
                    100: "#FFCA85",
                    200: "#FFBF69",
                    300: "#FFB85C",
                    400: "#FFAA33",
                    500: "#FF9F1C",
                    600: "#FF990A",
                    700: "#F58F00",
                    800: "#E08300",
                    900: "#CC7700",
                    DEFAULT: "#FF9F1C",
                    foreground: "#FFFFFF",
                },
            },
        },
    },
});

export default plugin;
