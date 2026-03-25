import { describe, it, expect } from "vitest";
import { validateEmail } from "@/infrastructure/validators/email.validator.ts";


describe("validateEmail - Unit", (): void => {

    it.each([
        'react@test.dev',
        'arthur.mathis@uha.fr',
        'dav1d_leGB@uha.fr',
        '1=32%krjg.s@uha.fr'
    ])('should validate - %s', (email: string): void => {
        expect(validateEmail(email)).toBeUndefined();
    });

    it.each([
        'bonjour',
        'read.dali@uha',
        'bonjour@',
        'bonjour@.com',
        'bonjour@.com.fr',
        'bonjour@.',
        '1=32%krjg.s@uha.86',
        '2',
        ' '
    ])(`should reject - %s`, (email: string): void => {
        const result = validateEmail(email);

        expect(result).toBeTypeOf('string');
        expect(result).toEqual('Email invalide');
    });

});