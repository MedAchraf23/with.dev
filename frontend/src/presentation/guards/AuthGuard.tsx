import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { useAuth } from "@/features/authentification/hooks/use-auth.hook.ts";

export default function AuthGuard(): ReactNode {
    const { session, loading } = useAuth();

    if (loading) return (
        <div data-testid="loading-spinner">
            <Spinner />
        </div>
    );
    if (!session) return <Navigate to="/auth" replace />;
    return <Outlet />;
}