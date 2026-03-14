import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { useAuth } from "@/features/authentification/hooks/use-auth.hook.ts";

/**
 * AuthGuard
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export default function AuthGuard() {
    const { session, loading } = useAuth();

    if (loading) return <Spinner />;
    if (!session) return <Navigate to="/auth" replace />;
    return <Outlet />;
}