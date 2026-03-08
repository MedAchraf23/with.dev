import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../../presentation/pages/NotFoundPage.tsx";
import RootLayout from "@/presentation/layouts/RootLayout.tsx";
import AuthLayout from "@/presentation/layouts/AuthLayout.tsx";
import AuthPage from "@/presentation/pages/AuthPage.tsx";

/**
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            // Routes publiques
            {
                path: "/auth",
                element: <AuthLayout />,
                children: [
                    { index: true, element: <AuthPage /> },
                ],
            },

            // 404
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
