export function validateEmail(email: string): string|undefined {
    if(!email) {
        return "Email requis";
    }
    if(!email.includes("@")) {
        return "Email invalide";
    }
    return undefined;
}