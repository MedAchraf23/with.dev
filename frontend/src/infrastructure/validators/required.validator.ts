export function validateRequired(value: string, label: string): string | undefined {
    if (!value || value.trim().length === 0) {
        return `${label} requis`;
    }

    return undefined;
}
