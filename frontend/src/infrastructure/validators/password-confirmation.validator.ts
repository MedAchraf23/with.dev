import { validatePassword } from "@/infrastructure/validators/password.validator.ts";

export function validatePasswordConfirmation(confirmation: string, password: string): string|undefined {
    const base = validatePassword(confirmation);
    if(base) {
        return base;
    }

    if(password !== confirmation) {
        return 'Les mots de passe ne correspondent pas';
    }

    return undefined;
}