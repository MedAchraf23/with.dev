import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "@/features/authentification/services/auth.service.ts";
import { Spinner } from "@heroui/react";

/**
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export default function GoogleCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const subscription = AuthService.onAuthStateChange((event, session) => {
            console.log("event:", event, "session:", session);
            if (session) {
                navigate("/dashboard");
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return <Spinner label="Connexion en cours..." />;
}