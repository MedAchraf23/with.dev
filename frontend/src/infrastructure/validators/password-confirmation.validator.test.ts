import { describe, expect, it } from "vitest";
import {validatePasswordConfirmation} from "@/infrastructure/validators/password-confirmation.validator.ts";

describe('validatePasswordConfirmation', (): void => {

    it('should validates password confirmation with same password', (): void => {
        expect(validatePasswordConfirmation('Password_123!', 'Password_123!'))
            .toBeUndefined();
    });

    it('should rejects password confirmation with different password', (): void => {
        expect(validatePasswordConfirmation('Password_123!', 'Password_456!')) // different
            .toBe('Les mots de passe ne correspondent pas');
    });

});