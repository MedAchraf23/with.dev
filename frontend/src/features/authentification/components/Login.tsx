import {Input} from "@heroui/input";
import {Button} from "@heroui/button";

export const Login = () => {
    return (
        <form className="flex flex-col gap-4 w-full max-w-sm">
            <h2 className="text-2xl font-bold">Connectez-vous</h2>
            <Input
                label="Email"
                placeholder="exemple@email.com"
                type="email"
                labelPlacement="outside"
                size="sm"
                isRequired
            />
            <Input
                label="Mot de passe"
                placeholder="Votre mot de passe"
                type="password"
                labelPlacement="outside"
                size="sm"
                isRequired
            />
            <Button type="submit" color="primary">Se connecter</Button>
        </form>
    );
}