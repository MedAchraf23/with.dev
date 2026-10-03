import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "@/presentation/layouts/RootLayout.tsx";
import AuthLayout from "@/presentation/layouts/AuthLayout.tsx";
import MainLayout from "@/presentation/layouts/MainLayout.tsx";
import {AuthPage} from "@/presentation/pages/Authentification/AuthPage.tsx";
import NotFoundPage from "@/presentation/pages/NotFoundPage.tsx";
import AuthCallback from "@/features/authentification/components/AuthCallback.tsx";
import AuthGuard from "@/presentation/guards/AuthGuard.tsx";
import ConfirmEmailPage from "@/presentation/pages/Authentification/ConfirmEmailPage.tsx";
import OffresPage from "@/presentation/pages/Offres/OffresPage.tsx";
import ProfilPage from "@/presentation/pages/Profil/ProfilPage.tsx";

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
                        element: <MainLayout />,
                        children: [
                            {
                                index: true,
                                element: <Navigate to="/offres" replace />
                            },
                            {
                                path: '/offres',
                                element: <OffresPage />
                            },
                            {
                                path: '/profil',
                                element: <ProfilPage />
                            },
                            {
                                path: "*",
                                element: <NotFoundPage />
                            },
                        ]
                    },
                ]
            },
        ],
    },
],);
