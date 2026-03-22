import { describe, it, expect } from "vitest";
import {validatePassword} from "@/infrastructure/validators/password.validator.ts";

describe('validatePassword - Unit', (): void => {

    it('should reject too short password', (): void => {
        expect(validatePassword('1234567890'))
            .toBe('12 caractères minimum');
    });

    it('should reject password without uppercase', (): void => {
        expect(validatePassword('1234567890abc'))
            .toBe('Une majuscule requise');
    });

    it('should reject password without lowercase', (): void => {
        expect(validatePassword('1234567890ABC'))
            .toBe('Une minuscule requise');
    });

    it('should reject password without special character', (): void => {
        expect(validatePassword('1234567890ABCdef'))
           .toBe('Un caractère spécial requis');
    });

    it.each([
        'Password_123',
        '3_Semaines_!'
    ])('should accept strong password - %s', (password: string): void => {
        expect(validatePassword(password)).toBeUndefined();
    });

});