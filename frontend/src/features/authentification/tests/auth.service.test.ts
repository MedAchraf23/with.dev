import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthService from '../services/auth.service';
import { supabase } from '@/infrastructure/api/supabase.api';

vi.mock('@/infrastructure/api/supabase.api', () => ({
    supabase: {
        auth: {
            signInWithPassword: vi.fn(),
            signUp: vi.fn(),
            signOut: vi.fn(),
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(() => ({
                data: { subscription: { unsubscribe: vi.fn() } },
            })),
        },
    },
}));

describe('AuthService - unit', () => {

    beforeEach(() => vi.clearAllMocks());

    describe('getSession', () => {

        it('should return a session if it exists', async () => {
            const fakeSession = { access_token: 'abc', user: { id: '1' } };
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: fakeSession },
                error: null,
            } as any);

            const session = await AuthService.getSession();
            expect(session).toEqual(fakeSession);
        });

        it('should return null if there is no session', async () => {
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: null },
                error: null,
            } as any);

            const session = await AuthService.getSession();
            expect(session).toBeNull();
        });

        it('should throw if an error occurs', async () => {
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: null },
                error: { message: 'Session error' },
            } as any);

            await expect(AuthService.getSession()).rejects.toThrow();
        });

    });

    describe('onAuthStateChange', () => {

        it('should return a subscription', () => {
            const subscription = AuthService.onAuthStateChange(vi.fn());
            expect(subscription).toHaveProperty('unsubscribe');
        });

    });

    describe('signIn', () => {

        it('shouldn\'t throw if request success', async () => {
            vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
                data: { user: {}, session: {} },
                error: null,
            } as any);

            await expect(AuthService.signIn('test@mail.com', 'password123')).resolves.toBeUndefined();
        });

        it('should throw if an error occurs', async () => {
            vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
                data: { user: null, session: null },
                error: { message: 'Invalid credentials' },
            } as any);

            await expect(AuthService.signIn('test@mail.com', 'wrong')).rejects.toThrow();
        });

    });

    describe('signUp', () => {

        it('shouldn\'t throw if request success', async () => {
            vi.mocked(supabase.auth.signUp).mockResolvedValue({
                data: { user: {}, session: {} },
                error: null,
            } as any);

            await expect(AuthService.signUp('new@mail.com', 'password123')).resolves.toBeUndefined();
        });

        it('should throw if the email address is already taken', async () => {
            vi.mocked(supabase.auth.signUp).mockResolvedValue({
                data: { user: null, session: null },
                error: { message: 'User already registered' },
            } as any);

            await expect(AuthService.signUp('existing@mail.com', 'password123')).rejects.toThrow();
        });

    });

    describe('signOut', () => {

        it('shouldn\'t throw if request success', async () => {
            vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as any);

            await expect(AuthService.signOut()).resolves.toBeUndefined();
        });

        it('should throw if an error occurs', async () => {
            vi.mocked(supabase.auth.signOut).mockResolvedValue({
                error: { message: 'Sign out failed' },
            } as any);

            await expect(AuthService.signOut()).rejects.toThrow();
        });

    });

});