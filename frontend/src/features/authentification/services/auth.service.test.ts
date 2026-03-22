import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthService from './auth.service.ts';
import { supabase } from '@/infrastructure/api/supabase.api.ts';
import {OtpType} from "@/features/authentification/interfaces/otp.type.ts";

vi.mock('@/infrastructure/api/supabase.api', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn(() => ({
                data: { subscription: { unsubscribe: vi.fn() } },
            })),
            verifyOtp: vi.fn(),
            signInWithPassword: vi.fn(),
            signInWithOAuth: vi.fn(),
            signUp: vi.fn(),
            signOut: vi.fn(),
        },
    },
}));

describe('AuthService - unit', (): void => {

    beforeEach(() => vi.clearAllMocks());

    describe('getSession', (): void => {

        it('should return a session if it exists', async (): Promise<void> => {
            const fakeSession = { access_token: 'abc', user: { id: '1' } };
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: fakeSession },
                error: null,
            } as any);

            const session = await AuthService.getSession();
            expect(session).toEqual(fakeSession);
        });

        it('should return null if there is no session', async (): Promise<void> => {
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: null },
                error: null,
            } as any);

            const session = await AuthService.getSession();
            expect(session).toBeNull();
        });

        it('should throw if an error occurs', async (): Promise<void> => {
            vi.mocked(supabase.auth.getSession).mockResolvedValue({
                data: { session: null },
                error: { message: 'Session error' },
            } as any);

            await expect(AuthService.getSession()).rejects.toThrow();
        });

    });

    describe('onAuthStateChange', (): void => {

        it('should return a subscription', (): void => {
            const subscription = AuthService.onAuthStateChange(vi.fn());
            expect(subscription).toHaveProperty('unsubscribe');
        });

    });

    describe('verifyOtp', (): void => {

        it('should verify token if it exists', async (): Promise<void> => {
            vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
                data: { user: {}, session: {} },
                error: null,
            } as any);

            await expect(AuthService.verifyOtp('abc123', OtpType.EMAIL)).resolves.toBeUndefined();
            expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
                token_hash: 'abc123',
                type: 'email',
            });
        });

        it('should throw an error if token doesn\'t exist', async (): Promise<void> => {
            vi.mocked(supabase.auth.verifyOtp).mockResolvedValue({
                data: { user: null, session: null },
                error: { message: 'Invalid token' },
            } as any);

            await expect(AuthService.verifyOtp('bad', OtpType.EMAIL)).rejects.toThrow();
        });

    });

    describe('signIn', (): void => {

        it('shouldn\'t throw if request success', async (): Promise<void> => {
            vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
                data: { user: {}, session: {} },
                error: null,
            } as any);

            await expect(AuthService.signIn('test@mail.com', 'password123')).resolves.toBeUndefined();
        });

        it('should throw if an error occurs', async (): Promise<void> => {
            vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
                data: { user: null, session: null },
                error: { message: 'Invalid credentials' },
            } as any);

            await expect(AuthService.signIn('test@mail.com', 'wrong')).rejects.toThrow();
        });

    });

    describe('signUp', (): void => {

        it('shouldn\'t throw if request success', async (): Promise<void> => {
            vi.mocked(supabase.auth.signUp).mockResolvedValue({
                data: { user: {}, session: {} },
                error: null,
            } as any);

            await expect(AuthService.signUp('new@mail.com', 'password123')).resolves.toBeUndefined();
        });

        it('should throw if the email address is already taken', async (): Promise<void> => {
            vi.mocked(supabase.auth.signUp).mockResolvedValue({
                data: { user: null, session: null },
                error: { message: 'User already registered' },
            } as any);

            await expect(AuthService.signUp('existing@mail.com', 'password123')).rejects.toThrow();
        });

    });

    describe('signInWithGoogle', (): void => {

        it('shouldn\'t throw if request success', async (): Promise<void> => {
            vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
                data: { url: 'https://google.com' },
                error: null,
            } as any);

            await expect(AuthService.signInWithGoogle()).resolves.toBeUndefined();
            expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
        });

        it('should throw if an error occurs', async (): Promise<void> => {
            vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
                data: { url: null },
                error: { message: 'OAuth failed' },
            } as any);

            await expect(AuthService.signInWithGoogle()).rejects.toThrow();
        });

    });

    describe('signOut', (): void => {

        it('shouldn\'t throw if request success', async (): Promise<void> => {
            vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as any);

            await expect(AuthService.signOut()).resolves.toBeUndefined();
        });

        it('should throw if an error occurs', async (): Promise<void> => {
            vi.mocked(supabase.auth.signOut).mockResolvedValue({
                error: { message: 'Sign out failed' },
            } as any);

            await expect(AuthService.signOut()).rejects.toThrow();
        });

    });

});