export function validatePassword(password: string): string | undefined {
    if (!password) {
        return "Mot de passe requis";
    }
    if (password.length < 12) {
        return "12 caractères minimum";
    }
    if (!/[A-Z]/.test(password)) {
        return "Une majuscule requise";
    }
    if (!/[a-z]/.test(password)) {
        return "Une minuscule requise";
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return "Un caractère spécial requis";
    }
    return undefined;
}
