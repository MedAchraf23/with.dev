import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import AuthProvider from '../contexts/AuthContext.tsx';
import { useAuth } from './use-auth.hook.ts';
import AuthService from '../services/auth.service.ts';
import { AuthChangeEvent } from "@supabase/supabase-js";
import { AuthContextType } from "@/features/authentification/interfaces/auth.type.ts";

vi.mock('../services/auth.service', () => ({
    default: {
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
    },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe('useAuth - Unit', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
        vi.mocked(AuthService.getSession).mockResolvedValue(null);
        vi.mocked(AuthService.onAuthStateChange).mockReturnValue({ unsubscribe: vi.fn() } as any);
    });

    describe('start context', (): void => {

        it('should start in loading then switch to false', async (): Promise<void> => {
            const { result } = renderHook(() => useAuth(), { wrapper });

            expect(result.current.loading).toBe(true);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.user).toBeNull();
        });

        it('should throw if is called outside AuthProvider', (): void => {
            const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => {
                renderHook(() => useAuth());
            }).toThrow();

            spy.mockRestore();
        });

    });

    describe('call AuthService', (): void => {

        it('should call AuthService::signIn', async (): Promise<void> => {
            vi.mocked(AuthService.signIn).mockResolvedValue(undefined);
            const { result } = renderHook((): AuthContextType => useAuth(), { wrapper });

            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(() => result.current.signIn('test@mail.com', 'pass'));

            expect(AuthService.signIn).toHaveBeenCalledWith('test@mail.com', 'pass');
        });

        it('should call AuthService::signUp', async (): Promise<void> => {
            vi.mocked(AuthService.signUp).mockResolvedValue(undefined);
            const { result } = renderHook((): AuthContextType => useAuth(), { wrapper });

            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(() => result.current.signUp('new@mail.com', 'pass'));

            expect(AuthService.signUp).toHaveBeenCalledWith('new@mail.com', 'pass');
        });

        it('should call AuthService::signOut', async (): Promise<void> => {
            vi.mocked(AuthService.signOut).mockResolvedValue(undefined);
            const { result } = renderHook((): AuthContextType => useAuth(), { wrapper });

            await waitFor(() => expect(result.current.loading).toBe(false));

            await act(() => result.current.signOut());

            expect(AuthService.signOut).toHaveBeenCalled();
        });

        it('should restore session on mount', async (): Promise<void> => {
            const fakeSession = { access_token: 'abc', user: { id: '1', email: 'test@mail.com' } };
            vi.mocked(AuthService.getSession).mockResolvedValue(fakeSession as any);

            const { result } = renderHook((): AuthContextType => useAuth(), { wrapper });

            await waitFor(() => expect(result.current.loading).toBe(false));

            expect(result.current.session).toEqual(fakeSession);
            expect(result.current.user).toEqual(fakeSession.user);
        });

        it('should update state when onAuthStateChange fires', async (): Promise<void> => {
            let authCallback: (event: AuthChangeEvent, session: any) => void;
            vi.mocked(AuthService.onAuthStateChange).mockImplementation((cb) => {
                authCallback = cb;
                return { unsubscribe: vi.fn() } as any;
            });

            const { result } = renderHook((): AuthContextType => useAuth(), { wrapper });

            await waitFor(() => expect(result.current.loading).toBe(false));

            const newSession = { access_token: 'xyz', user: { id: '2' } };
            act(() => authCallback('SIGNED_IN', newSession));

            expect(result.current.session).toEqual(newSession);
            expect(result.current.user).toEqual(newSession.user);
        });

        it('should unsubscribe on unmount', async () => {
            const unsubscribe = vi.fn();
            vi.mocked(AuthService.onAuthStateChange).mockReturnValue({ unsubscribe } as any);

            const { unmount } = renderHook(() => useAuth(), { wrapper });

            await waitFor(() => {});

            unmount();

            expect(unsubscribe).toHaveBeenCalled();
        });

    });

});