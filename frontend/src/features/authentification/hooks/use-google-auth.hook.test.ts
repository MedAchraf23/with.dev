import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useGoogleAuth } from "@/features/authentification/hooks/use-google-auth.hook.ts";
import AuthService from "@/features/authentification/services/auth.service.ts";

vi.mock('../services/auth.service', () => ({
    default: {
        signInWithGoogle: vi.fn(),
    },
}));

describe('useGoogleAuth - Unit', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    describe('Initial state', (): void => {

        it('should start with loading set to false', (): void => {
            const { result } = renderHook(() => useGoogleAuth());
            expect(result.current.loading).toBe(false);
        });

        it('should start with error set to null', (): void => {
            const { result } = renderHook(() => useGoogleAuth());
            expect(result.current.error).toBe(null);
        });

    });

    describe('Call AuthService', (): void => {

        it('should call AuthService.signInWithGoogle', async (): Promise<void> => {
            const { result } = renderHook(() => useGoogleAuth());

            await act(async (): Promise<void> => {
                await result.current.signInWithGoogle();
            });

            expect(AuthService.signInWithGoogle).toHaveBeenCalledTimes(1);
        });

    });

});