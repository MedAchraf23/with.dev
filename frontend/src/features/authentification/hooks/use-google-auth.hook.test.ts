import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { addToast } from "@heroui/toast";
import { useGoogleAuth } from "@/features/authentification/hooks/use-google-auth.hook.ts";
import AuthService from "@/features/authentification/services/auth.service.ts";

vi.mock('@/features/authentification/services/auth.service', () => ({
    default: {
        signInWithGoogle: vi.fn(),
    },
}));

vi.mock('@heroui/toast', () => ({
    addToast: vi.fn(),
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

    describe('Loading state', (): void => {

        it('should set loading to true during signInWithGoogle and back to false after', async (): Promise<void> => {
            let resolvePromise: () => void;
            vi.mocked(AuthService.signInWithGoogle).mockImplementation(
                () => new Promise<void>((resolve) => { resolvePromise = resolve; })
            );

            const { result } = renderHook(() => useGoogleAuth());

            let promise: Promise<void>;
            act(() => {
                promise = result.current.signInWithGoogle();
            });

            expect(result.current.loading).toBe(true);

            await act(async () => {
                resolvePromise!();
                await promise!;
            });

            expect(result.current.loading).toBe(false);
        });

    });

    describe('Error handling', (): void => {

        it('should set error and display a toast on failure', async (): Promise<void> => {
            vi.mocked(AuthService.signInWithGoogle).mockRejectedValue(new Error('fail'));

            const { result } = renderHook(() => useGoogleAuth());

            await act(async (): Promise<void> => {
                await result.current.signInWithGoogle();
            });

            expect(result.current.error).toBe("Erreur lors de la connexion Google");
            expect(result.current.loading).toBe(false);
            expect(addToast).toHaveBeenCalledWith({
                title: "Échec de connexion",
                description: "Erreur lors de la connexion Google",
                color: "danger",
            });
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