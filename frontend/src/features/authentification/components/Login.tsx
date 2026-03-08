import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { addToast } from "@heroui/toast";
import { useAuth } from "@/features/authentification/hooks/use-auth.hook.ts";
import { useGoogleAuth } from "@/features/authentification/hooks/use-google-auth.hook.ts";
import AuthService from "@/features/authentification/services/auth.service.ts";


export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    // todo : remove after debug
    useEffect(() => {
        AuthService.signOut();
        console.log('Deconnexion ! ');
    }, []);

    const { signInWithGoogle, loading: googleLoading } = useGoogleAuth();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
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
                setError(err.message ?? "Erreur de connexion");
            }
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className="flex flex-col gap-4 w-full"
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
                <Button size="sm" className="bg-black text-white" startContent={<FaGithub size={14} />}>GitHub</Button>
                <Button size="sm" className="bg-black text-white" startContent={<FaMicrosoft size={14} />}>Microsoft</Button>
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
                    onChange: ({ value }) =>
                        !value ? "Email requis" : !value.includes("@") ? "Email invalide" : undefined,
                }}
            >
                {(field) => (
                    <Input
                        label="Email"
                        placeholder="exemple@email.com"
                        type="email"
                        labelPlacement="outside"
                        size="sm"
                        isRequired
                        value={field.state.value}
                        onValueChange={(v) => field.handleChange(v)}
                        isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                    />
                )}
            </form.Field>

            <form.Field
                name="password"
                validators={{
                    onChange: ({ value }) =>
                        !value ? "Mot de passe requis" : value.length < 6 ? "6 caractères minimum" : undefined,
                }}
            >
                {(field) => (
                    <Input
                        label="Mot de passe"
                        placeholder="Votre mot de passe"
                        type="password"
                        labelPlacement="outside"
                        size="sm"
                        isRequired
                        value={field.state.value}
                        onValueChange={(v) => field.handleChange(v)}
                        isInvalid={field.state.meta.isTouched && !!field.state.meta.errors.length}
                        errorMessage={field.state.meta.errors[0]?.toString()}
                    />
                )}
            </form.Field>
            <button type="button" className="self-end -mt-2 text-foreground-500 text-xs hover:underline">
                Mot de passe oublié ?
            </button>


            <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                    <Button type="submit" isLoading={isSubmitting} className="text-white bg-black mt-4">
                        Se connecter
                    </Button>
                )}
            </form.Subscribe>
        </form>
    );
}