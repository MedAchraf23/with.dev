import { ReactNode } from "react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, cleanup, render, screen} from "@testing-library/react";
import { useAuth } from "@/features/authentification/hooks/use-auth.hook.ts";
import AuthProvider from "@/features/authentification/contexts/AuthContext.tsx";
import AuthService from "@/features/authentification/services/auth.service.ts";

vi.mock('@/features/authentification/services/auth.service.ts', () => ({
    default: {
        getSession: vi.fn().mockResolvedValue(null),
        onAuthStateChange: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
    },
}));

function TestConsumer(): ReactNode {
    const auth = useAuth();
    return (
        <>
            <div data-testid="loading">{String(auth.loading)}</div>
            <div data-testid="user">{String(auth.user)}</div>
            <div data-testid="session">{String(auth.session)}</div>
            <button onClick={(): Promise<void> => auth.signIn('test@test.com', 'password')}>SignIn</button>
            <button onClick={(): Promise<void> => auth.signUp('test@test.com', 'password')}>SignUp</button>
            <button onClick={(): Promise<void> => auth.signOut()}>SignOut</button>
        </>
    );
}

function renderAuthProvider() {
    return render(
        <AuthProvider>
            <TestConsumer />
        </AuthProvider>
    );
}

describe('AuthContext - Integration', (): void => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    describe('Initial state', (): void => {

        it('should start with loading set at true', (): void => {
            renderAuthProvider();
            expect(screen.getByTestId('loading').textContent).toBe('true');
        });

        it('should start with user set at null', (): void => {
            renderAuthProvider();
            expect(screen.getByTestId('user').textContent).toBe('null');
        });

        it('should start with session set at null', (): void => {
            renderAuthProvider();
            expect(screen.getByTestId('session').textContent).toBe('null');
        });

        it('should call AuthService.getSession', async (): Promise<void> => {
            renderAuthProvider();
            expect(AuthService.getSession).toHaveBeenCalledTimes(1);
        });

    });

    describe('Call AuthService', (): void => {

        it('should call AuthService.signIn', async (): Promise<void> => {
            renderAuthProvider();

            await act(async (): Promise<void> => {
                screen.getByRole('button', { name: 'SignIn' }).click();
            });

            expect(AuthService.signIn).toHaveBeenCalledTimes(1);
            expect(AuthService.signIn).toHaveBeenCalledWith('test@test.com', 'password');
        });

        it('should call AuthService.signUp', async (): Promise<void> => {
            renderAuthProvider();

            await act(async (): Promise<void> => {
                screen.getByRole('button', { name: 'SignUp' }).click();
            });

            expect(AuthService.signUp).toHaveBeenCalledTimes(1);
            expect(AuthService.signUp).toHaveBeenCalledWith('test@test.com', 'password');
        });

        it('should call AuthService.signOut', async (): Promise<void> => {
            renderAuthProvider();

            await act(async (): Promise<void> => {
                screen.getByRole('button', { name: 'SignOut' }).click();
            });

            expect(AuthService.signOut).toHaveBeenCalledTimes(1);
        });

    });

});