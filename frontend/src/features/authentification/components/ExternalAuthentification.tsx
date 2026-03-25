import { ReactNode } from "react";
import { Button } from "@heroui/button";
import { FaGithub, FaGitlab, FaGoogle, FaLinkedin, FaMicrosoft } from "react-icons/fa";
import { useGoogleAuth } from "@/features/authentification/hooks/use-google-auth.hook.ts";

export default function ExternalAuthentification(): ReactNode {
    const { signInWithGoogle, loading: googleLoading } = useGoogleAuth();

    return (
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
    );
}
