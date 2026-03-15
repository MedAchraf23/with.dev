export function validateEmail(email: string): string|undefined {
    if(!email) {
        return "Email requis";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return "Email invalide";
    }

    return undefined;
}