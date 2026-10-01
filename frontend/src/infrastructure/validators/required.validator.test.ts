import { describe, it, expect } from 'vitest';
import { validateRequired } from '@/infrastructure/validators/required.validator.ts';

describe('validateRequired - Unit', (): void => {

    it('should return an error mentioning the label when the value is empty', (): void => {
        expect(validateRequired('', 'Prénom')).toBe('Prénom requis');
    });

    it('should return an error when the value only contains spaces', (): void => {
        expect(validateRequired('   ', 'Nom')).toBe('Nom requis');
    });

    it('should return undefined when the value is filled', (): void => {
        expect(validateRequired('Jean', 'Prénom')).toBeUndefined();
    });

});
