import { FormEvent, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { Button } from "@heroui/button";
import { useAuth } from "@/features/authentification/hooks/use-auth.hook.ts";
import ExternalAuthentification from "@/features/authentification/components/ExternalAuthentification.tsx";
import Separator from "@/presentation/components/Separator.tsx";
import EmailField from "@/features/authentification/components/fields/EmailField.tsx";
import PasswordField from "@/features/authentification/components/fields/PasswordField.tsx";
import { validateEmail } from "@/infrastructure/validators/email.validator.ts";
import { validatePassword } from "@/infrastructure/validators/password.validator.ts";
import { validatePasswordConfirmation } from "@/infrastructure/validators/password-confirmation.validator.ts";

export default function SignUp(): ReactNode {
    const navigate = useNavigate();
    const [error, setError] = useState<string|null>(null);

    const { signUp } = useAuth();

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
            confirmation: ''
        },
        onSubmit: async ({ value }: { value: { email: string, password: string, confirmation: string } }): Promise<void> => {
            setError(null);
            try {
                await signUp(value.email, value.password);
                navigate('/auth/confirm-email', {
                    state: { email: value.email },
                    replace: true,
                });
            } catch (err: any) {
                console.error(err);
                setError("L'inscription a échoué...");
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

            <form.Field
                name="confirmation"
                validators={{
                    onChangeListenTo: ['password'],
                    onBlur: ({ value, fieldApi }): string|undefined =>
                        validatePasswordConfirmation(value, fieldApi.form.getFieldValue("password")),
                    onChange: ({ value, fieldApi }): string|undefined =>
                        validatePasswordConfirmation(value, fieldApi.form.getFieldValue("password")),
                    onSubmit: ({ value, fieldApi }): string|undefined =>
                        validatePasswordConfirmation(value, fieldApi.form.getFieldValue("password")),
                }}
            >
                {(field) => <PasswordField field={field} isConfirmation />}
            </form.Field>

            <Button
                type="submit"
                className="text-white bg-black mt-4"
            >
                S'inscrire
            </Button>
        </form>
    );
}