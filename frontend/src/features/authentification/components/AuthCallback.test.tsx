import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {AuthChangeEvent, Session, Subscription} from "@supabase/supabase-js";
import AuthCallback from "@/features/authentification/components/AuthCallback.tsx";
import AuthService from "@/features/authentification/services/auth.service.ts";

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('@/features/authentification/services/auth.service.ts', () => ({
    default: {
        onAuthStateChange: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        verifyOtp: vi.fn(),
    },
}));

vi.mock('@heroui/toast', () => ({
    addToast: vi.fn(),
}));

function renderWithUrl(url: string) {
    return render(
        <MemoryRouter initialEntries={[url]}>
            <AuthCallback />
        </MemoryRouter>
    );
}


describe('AutCallback - Integration', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
        window.location.hash = '';
    });

    afterEach((): void => {
        cleanup();
    });

    describe('Loading state', (): void => {

        it('should show spinner while loading', (): void => {
            renderWithUrl('/auth/callback');
            expect(screen.getByText('Authentification en cours...')).toBeTruthy();
        });

    });

    describe('Hash error', (): void => {

        it('should show error when hash contains error', async (): Promise<void> => {
            window.location.hash = '#error=access_denied';

            await act(async (): Promise<void> => {
                renderWithUrl('/auth/callback');
            });

            expect(screen.getByText('Une erreur est survenue. Veuillez réessayer.')).toBeTruthy();
        });

        it('should show back button on error', async (): Promise<void> => {
            window.location.hash = '#error=access_denied';

            await act(async (): Promise<void> => {
                renderWithUrl('/auth/callback');
            });

            expect(screen.getByRole('button', { name: 'Retour à la connexion' })).toBeTruthy();
        });

    });

    describe('OTP verification', (): void => {

        it('should call verifyOtp with token_hash and type', async (): Promise<void> => {
            vi.mocked(AuthService.verifyOtp).mockResolvedValue(undefined);

            await act(async (): Promise<void> => {
                renderWithUrl('/auth/callback?token_hash=abc123&type=email');
            });

            expect(AuthService.verifyOtp).toHaveBeenCalledWith('abc123', 'email');
        });

        it('should navigate to dashboard on success', async (): Promise<void> => {
            vi.mocked(AuthService.verifyOtp).mockResolvedValue(undefined);

            await act(async (): Promise<void> => {
                renderWithUrl('/auth/callback?token_hash=abc123&type=email');
            });

            expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
        });

        it('should show error on verifyOtp failure', async (): Promise<void> => {
            vi.mocked(AuthService.verifyOtp).mockRejectedValue(new Error('expired'));

            await act(async (): Promise<void> => {
                renderWithUrl('/auth/callback?token_hash=abc123&type=email');
            });

            expect(screen.getByText('La vérification a échoué. Le lien est peut-être expiré.')).toBeTruthy();
        });

    });

    describe('Auth state change (no token_hash)', (): void => {

        it('should call onAuthStateChange when no token_hash', (): void => {
            renderWithUrl('/auth/callback');
            expect(AuthService.onAuthStateChange).toHaveBeenCalledTimes(1);
        });

        it('should navigate to dashboard when session received', async (): Promise<void> => {
            vi.mocked(AuthService.onAuthStateChange).mockImplementation((callback): Subscription => {
                callback('SIGNED_IN' as any, { user: {} } as any);
                return {
                    callback(_event: AuthChangeEvent, _session: Session | null): void {},
                    id: '',
                    unsubscribe: vi.fn()
                };
            });

            await act(async (): Promise<void> => {
                renderWithUrl('/auth/callback');
            });

            expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
        });

    });

});