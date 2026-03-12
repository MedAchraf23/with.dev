import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import AuthProvider from '../contexts/AuthContext';
import { useAuth } from '../hooks/use-auth.hook';
import AuthService from '../services/auth.service';

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

describe('useAuth', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(AuthService.getSession).mockResolvedValue(null);
        vi.mocked(AuthService.onAuthStateChange).mockReturnValue({ unsubscribe: vi.fn() } as any);
    });

    it('should start in loading then switch to false', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.loading).toBe(true);

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.user).toBeNull();
    });

    it('should call AuthService::signIn', async () => {
        vi.mocked(AuthService.signIn).mockResolvedValue(undefined);
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.loading).toBe(false));

        await act(() => result.current.signIn('test@mail.com', 'pass'));

        expect(AuthService.signIn).toHaveBeenCalledWith('test@mail.com', 'pass');
    });

    it('should throw if is called outside AuthProvider', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => {
            renderHook(() => useAuth());
        }).toThrow();

        spy.mockRestore();
    });

});