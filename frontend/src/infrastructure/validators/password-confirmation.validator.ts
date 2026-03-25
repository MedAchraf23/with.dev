export function validatePasswordConfirmation(confirmation: string, password: string): string|undefined {
    if (!confirmation) {
        return "Confirmation requise";
    }

    if(password !== confirmation) {
        return 'Les mots de passe ne correspondent pas';
    }

    return undefined;
}