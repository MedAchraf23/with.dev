import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Button } from "@heroui/button";

export default function ConfirmEmailPage(): ReactNode {
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 text-center px-4">
            <h1 className="text-2xl font-bold">Vérifiez votre boîte email</h1>
            <p className="text-foreground-500">
                Un email de confirmation a été envoyé à <strong>{email}</strong>.
            </p>
            <p className="text-foreground-400 text-sm">
                Cliquez sur le lien dans l'email pour activer votre compte.
            </p>
            <Button
                as="a"
                href="/auth"
                variant="light"
            >
                Retour à la connexion
            </Button>
        </div>
    );
}
