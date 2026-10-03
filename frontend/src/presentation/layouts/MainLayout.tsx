import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import AppNavbar from "@/presentation/components/AppNavbar.tsx";

export default function MainLayout(): ReactNode {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <AppNavbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
