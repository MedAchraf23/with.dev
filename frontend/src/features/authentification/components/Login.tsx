import { FormEvent, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { FaGoogle, FaGithub, FaMicrosoft, FaGitlab, FaLinkedin } from "react-icons/fa";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { addToast } from "@heroui/toast";
import { useAuth } from "@/features/authentification/hooks/use-auth.hook.ts";
import { useGoogleAuth } from "@/features/authentification/hooks/use-google-auth.hook.ts";
import { validatePassword } from "@/infrastructure/validators/password.validator.ts";
import { validateEmail } from "@/infrastructure/validators/email.validator.ts";

export default function Login(): ReactNode {
    const navigate = useNavigate();

    const [error, setError] = useState<string|null>(null);

    const { signIn } = useAuth();
    const { signInWithGoogle, loading: googleLoading } = useGoogleAuth();

    const form = useForm({
        onSubmit: async ({ value }: { value: { email: string, password: string } }): Promise<void> => {
            console.log("Submit with " + value);
            setError(null);
            try {
                await signIn(value.email, value.password);
                addToast({
                    title: "Connexion réussie",
                    description: "Bienvenue sur With.dev 👋",
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
            <section className="flex gap-2 w-full">
                <Button
                    size="sm"
                    className="bg-black text-white"
                    startContent={<FaGoogle size={14} />}
                    isLoading={googleLoading}
                    onPress={signInWithGoogle}
                >
                    Google
                </Button>
                <Button isDisabled size="sm" className="bg-black text-white" startContent={<FaLinkedin size={14} />}>Linkedin</Button>
                <Button isDisabled size="sm" className="bg-black text-white" startContent={<FaGithub size={14} />}>GitHub</Button>
                <Button isDisabled size="sm" className="bg-black text-white" startContent={<FaGitlab size={14} />}>GitLab</Button>
                <Button isDisabled size="sm" className="bg-black text-white" startContent={<FaMicrosoft size={14} />}>Microsoft</Button>
            </section>

            <div className="flex items-center gap-4">
                <Divider className="flex-1" />
                <span className="text-foreground-500 text-sm">ou</span>
                <Divider className="flex-1" />
            </div>

            {error && <p className="text-danger text-sm">{error}</p>}

            <form.Field
                name="email"
                validators={{
                    onBlur: ({ value }: { value:string }): string|undefined => validateEmail(value),
                    onChange: ({ value }: { value:string }): string|undefined => validateEmail(value),
                    onSubmit: ({ value }: { value:string }): string|undefined => validatePassword(value)
                }}
            >
                {(field): ReactNode => (
                    <Input
                        label="Email"
                        placeholder="exemple@email.com"
                        type="email"
                        labelPlacement="outside"
                        size="sm"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onValueChange={(value: string): void => field.handleChange(value)}
                        isInvalid={!!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                    />
                )}
            </form.Field>

            <form.Field
                name="password"
                validators={{
                    onBlur: ({ value }: { value:string }): string|undefined => validatePassword(value),
                    onChange: ({ value }: { value:string }): string|undefined => validatePassword(value),
                    onSubmit: ({ value }: { value:string }): string|undefined => validatePassword(value)
                }}
            >
                {(field): ReactNode => (
                    <Input
                        label="Mot de passe"
                        placeholder="Votre mot de passe"
                        type="password"
                        labelPlacement="outside"
                        size="sm"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onValueChange={(value: string): void => field.handleChange(value)}
                        isInvalid={!!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                    />
                )}
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
                        // onPress={async () => {
                        //     await form.handleSubmit();
                        // }}
                    >
                        Se connecter
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}