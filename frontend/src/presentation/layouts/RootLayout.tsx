import { ReactNode } from "react";
import { Outlet, useHref, useNavigate } from "react-router-dom";
import type { NavigateOptions } from "react-router-dom";
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import AuthContext from "@/features/authentification/contexts/AuthContext.tsx";

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NavigateOptions;
    }
}

export default function RootLayout(): ReactNode {
    const navigate = useNavigate();

    return (
        <HeroUIProvider navigate={navigate} useHref={useHref}>
            <AuthContext>
                <ToastProvider placement="top-right" />
                <Outlet />
            </AuthContext>
        </HeroUIProvider>
    );
}
