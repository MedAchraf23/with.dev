import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
import { AuthChangeEvent, Session} from "@supabase/supabase-js";
import { OtpType } from "@/features/authentification/interfaces/otp.type.ts";
import AuthService from "@/features/authentification/services/auth.service.ts";

export default function AuthCallback(): ReactNode {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes("error")) {
            const hashParams = new URLSearchParams(hash.substring(1));
            if (hashParams.has("error")) {
                setError("Une erreur est survenue. Veuillez réessayer.");
                return;
            }
        }

        const tokenHash = searchParams.get("token_hash");
        const type = searchParams.get("type");

        if (!tokenHash || !type) {
            const subscription = AuthService.onAuthStateChange((_event: AuthChangeEvent, session: Session|null): void => {
                if (session) {
                    addToast({
                        title: "Connexion réussie 🎉",
                        color: "success",
                        timeout: 3000
                    });
                    navigate("/dashboard", { replace: true });
                }
            });

            const timeout = setTimeout((): void => setError("Aucune session reçue."), 10_000);

            return () => {
                clearTimeout(timeout);
                subscription.unsubscribe();
            };
        }

        const validOtpTypes: OtpType[] = Object.values(OtpType);
        if (!validOtpTypes.includes(type as OtpType)) {
            setError("Lien de vérification invalide.");
            return;
        }

        AuthService.verifyOtp(tokenHash, type as OtpType)
            .then((): void => {
                addToast({
                    title: "Compte confirmé 🎉",
                    color: "success",
                    timeout: 3000
                });
                navigate("/dashboard", { replace: true });
            })
            .catch((): void => setError("La vérification a échoué. Le lien est peut-être expiré."));
    }, [navigate, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-danger text-lg">{error}</p>
                <Button
                    onPress={() => navigate("/auth", { replace: true })}
                    className="text-white bg-black"
                >
                    Retour à la connexion
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <Spinner label="Authentification en cours..." />
        </div>
    );
}
