import { Outlet, useNavigate } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { useAuth } from "@/features/authentification/hooks/use-auth.hook.ts";

/**
 * AuthGuard
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export default function AuthGuard() {
    const navigate = useNavigate();
    const {session, loading} = useAuth();

    if(loading) {
        return <Spinner />
    }

    else if(!session) {
        navigate('/auth');
    }

    else {
        return <Outlet />;
    }

}