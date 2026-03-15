import { FormEvent, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useAuth } from "@/features/authentification/hooks/use-auth.hook.ts";
import { validatePassword } from "@/infrastructure/validators/password.validator.ts";
import { validateEmail } from "@/infrastructure/validators/email.validator.ts";
import ExternalAuthentification from "@/features/authentification/components/ExternalAuthentification.tsx";
import Separator from "@/presentation/components/Separator.tsx";
import EmailField from "@/features/authentification/components/fields/EmailField.tsx";
import PasswordField from "@/features/authentification/components/fields/PasswordField.tsx";

export default function SignIn(): ReactNode {
    const navigate = useNavigate();

    const [error, setError] = useState<string|null>(null);

    const { signIn } = useAuth();

    const form = useForm({
        onSubmit: async ({ value }: { value: { email: string, password: string } }): Promise<void> => {
            setError(null);
            try {
                await signIn(value.email, value.password);
                addToast({
                    title: "Connexion réussie",
                    description: "Bon retour parmi nous 👋",
                    color: "success",
                    timeout: 3000,
                });
                navigate("/dashboard");
            } catch (err: any) {
                setError("La connexion a échoué : identifiants de connexion incorrects");
            }
        },
    });

    return (
        <form
            className="flex flex-col gap-4 w-full"
            onSubmit={async (e: FormEvent): Promise<void> => {
                e.preventDefault();
                e.stopPropagation();
                await form.handleSubmit();
            }}
        >
            <ExternalAuthentification/>

            <Separator/>

            {error && <p className="text-danger text-sm">{error}</p>}

            <form.Field
                name="email"
                validators={{
                    onBlur: ({ value }: { value:string }): string|undefined => validateEmail(value),
                    onChange: ({ value }: { value:string }): string|undefined => validateEmail(value),
                    onSubmit: ({ value }: { value:string }): string|undefined => validateEmail(value)
                }}
            >
                {(field) => <EmailField field={field} />}
            </form.Field>

            <form.Field
                name="password"
                validators={{
                    onBlur: ({ value }: { value:string }): string|undefined => validatePassword(value),
                    onChange: ({ value }: { value:string }): string|undefined => validatePassword(value),
                    onSubmit: ({ value }: { value:string }): string|undefined => validatePassword(value)
                }}
            >
                {(field) => <PasswordField field={field} />}
            </form.Field>

            <button type="button" className="self-end -mt-2 text-foreground-500 text-xs hover:underline">
                Mot de passe oublié ?
            </button>

            <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting): ReactNode => (
                    <Button
                        type="submit"
                        className="text-white bg-black mt-4"
                        isLoading={isSubmitting}
                    >
                        Se connecter
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}