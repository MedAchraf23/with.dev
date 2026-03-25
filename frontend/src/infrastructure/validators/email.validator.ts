export function validateEmail(email: string): string | undefined {
    if (!email || email.length == 0) {
        return "Email requis";
    }

    const emailRegex = /^[^\s@]+@[a-zA-Z0-9][^\s@]*\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return "Email invalide";
    }

    return undefined;
}
