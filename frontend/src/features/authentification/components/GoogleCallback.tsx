import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Spinner } from "@heroui/react";
import AuthService from "@/features/authentification/services/auth.service.ts";

/**
 * @function GoogleCallback
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export default function GoogleCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState(false);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes("error")) {
            setError(true);
            return;
        }

        const timeout = setTimeout(() => setError(true), 10000);

        const subscription = AuthService.onAuthStateChange((_event, session) => {
            if (session) {
                clearTimeout(timeout);
                navigate("/dashboard");
            }
        });

        return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, [navigate]);

    if (error) return <Navigate to="/auth" replace />;

    return <Spinner label="Connexion en cours..." />;
}
