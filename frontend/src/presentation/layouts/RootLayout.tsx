import { HeroUIProvider } from "@heroui/system";
import { Outlet, useHref, useNavigate } from "react-router-dom";
import type { NavigateOptions } from "react-router-dom";
import AuthContext from "@/features/authentification/contexts/AuthContext.tsx";
import { ToastProvider } from "@heroui/toast";

declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NavigateOptions;
    }
}

/**
 * @function RootLayout
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export default function RootLayout() {
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
