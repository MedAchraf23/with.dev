import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../../presentation/pages/NotFoundPage.tsx";
import MainLayout from "@/presentation/layouts/MainLayout.tsx";
import RootLayout from "@/presentation/layouts/RootLayout.tsx";
import AuthLayout from "@/presentation/layouts/AuthLayout.tsx";
import {LoginPage} from "@/presentation/pages/LoginPage.tsx";

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path:"/auth",
                element: <AuthLayout />,
                children: [
                    {
                        index: true,
                        element: <LoginPage />
                    }
                ]
            },
            {
                path: "*",
                element: <MainLayout />,
                children: [
                    {
                        index: true,
                        element: <NotFoundPage />
                    },
                ]
            }
        ]
    },
]);
