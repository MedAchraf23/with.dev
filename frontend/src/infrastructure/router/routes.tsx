import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../../presentation/pages/NotFoundPage.tsx";
import RootLayout from "@/presentation/layouts/RootLayout.tsx";
import AuthLayout from "@/presentation/layouts/AuthLayout.tsx";
import AuthPage from "@/presentation/pages/AuthPage.tsx";
import Dashboard from "@/presentation/pages/Dashboard.tsx";
import GoogleCallback from "@/features/authentification/components/GoogleCallback.tsx";

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
                    {
                        index: true,
                        element: <AuthPage />
                    },
                    {
                        path: 'callback',
                        element: <GoogleCallback />
                    }
                ],
            },

            // Routes protégées
            {
                path: '/dashboard',
                element: <Dashboard />
            },

            // 404
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
