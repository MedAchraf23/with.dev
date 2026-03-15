export function validatePassword(password: string): string|undefined {
    if(!password) {
        return "Mot de passe requis";
    }
    if(password.length < 8) {
        return "8 caractères minimum";
    }
    return undefined;
}