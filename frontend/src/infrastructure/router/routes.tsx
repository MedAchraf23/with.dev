import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/presentation/layouts/RootLayout.tsx";
import AuthLayout from "@/presentation/layouts/AuthLayout.tsx";
import {AuthPage} from "@/presentation/pages/Authentification/AuthPage.tsx";
import Dashboard from "@/presentation/pages/Dashboard.tsx";
import NotFoundPage from "@/presentation/pages/NotFoundPage.tsx";
import AuthCallback from "@/features/authentification/components/AuthCallback.tsx";
import AuthGuard from "@/presentation/guards/AuthGuard.tsx";
import ConfirmEmailPage from "@/presentation/pages/Authentification/ConfirmEmailPage.tsx";

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
                        path: 'confirm-email',
                        element: <ConfirmEmailPage />,
                    },
                    {
                        path: 'callback',
                        element: <AuthCallback />
                    }
                ],
            },
            {
                element: <AuthGuard />,
                children: [
                    {
                        path: '/dashboard',
                        element: <Dashboard />
                    },
                    {
                        path: "*",
                        element: <NotFoundPage />
                    },
                ]
            },
        ],
    },
],);
