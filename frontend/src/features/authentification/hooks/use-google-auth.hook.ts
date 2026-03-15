import { useState } from "react";
import { addToast } from "@heroui/toast";
import AuthService from "@/features/authentification/services/auth.service.ts";

/**
 * @function useGoogleAuth
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export const useGoogleAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signInWithGoogle = async () => {
        setLoading(true);
        setError(null);
        try {
            await AuthService.signInWithGoogle();
        } catch (err: unknown) {
            const message = "Erreur lors de la connexion Google";
            setError(message);
            addToast({
                title: "Échec de connexion",
                description: message,
                color: "danger",
            });
        } finally {
            setLoading(false);
        }
    };

    return { signInWithGoogle, loading, error };
};