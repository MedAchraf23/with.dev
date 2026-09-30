// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';
import BackendApi, { ApiError } from './backend.api.ts';
import { supabase } from '@/infrastructure/api/supabase.api.ts';

vi.mock('@/infrastructure/api/supabase.api', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
        },
    },
}));

function mockSession(accessToken: string | null): void {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: accessToken === null ? null : { access_token: accessToken } },
        error: null,
    } as any);
}

function mockResponse(status: number, body: unknown): void {
    global.fetch = vi.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        statusText: 'Status ' + status,
        json: async () => body,
    } as any);
}

function lastCall(): [string, RequestInit] {
    return vi.mocked(global.fetch).mock.calls[0] as unknown as [string, RequestInit];
}

describe('BackendApi - unit', (): void => {

    beforeEach(() => vi.clearAllMocks());

    describe('get', (): void => {

        it('should call the configured backend url and return the parsed body', async (): Promise<void> => {
            mockSession('token-abc');
            mockResponse(200, [{ id: 1 }]);

            const result = await BackendApi.get('/job-offers');

            expect(result).toEqual([{ id: 1 }]);
            expect(lastCall()[0]).toBe('http://localhost:8081/api/job-offers');
            expect(lastCall()[1].method).toBe('GET');
        });

        it('should attach the supabase access token as a bearer header', async (): Promise<void> => {
            mockSession('token-abc');
            mockResponse(200, []);

            await BackendApi.get('/job-offers');

            const headers = lastCall()[1].headers as Record<string, string>;
            expect(headers.Authorization).toBe('Bearer token-abc');
        });

        it('should not attach any authorization header without a session', async (): Promise<void> => {
            mockSession(null);
            mockResponse(200, []);

            await BackendApi.get('/job-offers');

            const headers = lastCall()[1].headers as Record<string, string>;
            expect(headers.Authorization).toBeUndefined();
        });

        it('should append the query parameters that have a value', async (): Promise<void> => {
            mockSession('token-abc');
            mockResponse(200, []);

            await BackendApi.get('/job-offers', { search: 'java', city: 'Lyon' });

            expect(lastCall()[0]).toBe('http://localhost:8081/api/job-offers?search=java&city=Lyon');
        });

        it('should ignore empty, null and undefined query parameters', async (): Promise<void> => {
            mockSession('token-abc');
            mockResponse(200, []);

            await BackendApi.get('/job-offers', { search: '', city: null, contractType: undefined });

            expect(lastCall()[0]).toBe('http://localhost:8081/api/job-offers');
        });

    });

    describe('post', (): void => {

        it('should send the body as json', async (): Promise<void> => {
            mockSession('token-abc');
            mockResponse(201, { id: 1 });

            const result = await BackendApi.post('/candidates', { firstName: 'Jean' });

            expect(result).toEqual({ id: 1 });
            expect(lastCall()[1].method).toBe('POST');
            expect(lastCall()[1].body).toBe('{"firstName":"Jean"}');
        });

    });

    describe('patch', (): void => {

        it('should send the body as json', async (): Promise<void> => {
            mockSession('token-abc');
            mockResponse(200, { id: 1 });

            await BackendApi.patch('/candidates/me', { city: 'Mulhouse' });

            expect(lastCall()[1].method).toBe('PATCH');
            expect(lastCall()[1].body).toBe('{"city":"Mulhouse"}');
        });

    });

    describe('error handling', (): void => {

        it('should throw an ApiError carrying the status and the backend message', async (): Promise<void> => {
            mockSession('token-abc');
            mockResponse(404, { status: 404, error: 'Not Found', message: 'Offre non trouvée' });

            await expect(BackendApi.get('/job-offers/1')).rejects.toThrowError(
                expect.objectContaining({ name: 'ApiError', status: 404, message: 'Offre non trouvée' })
            );
        });

        it('should fall back on the status text when the error body is not json', async (): Promise<void> => {
            mockSession(null);
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 401,
                statusText: 'Unauthorized',
                json: async () => {
                    throw new Error('not json');
                },
            } as any);

            await expect(BackendApi.get('/job-offers')).rejects.toThrowError(
                expect.objectContaining({ status: 401, message: 'Unauthorized' })
            );
        });

        it('should expose ApiError as a real Error instance', async (): Promise<void> => {
            mockSession('token-abc');
            mockResponse(500, { message: 'Erreur interne.' });

            await expect(BackendApi.get('/job-offers')).rejects.toBeInstanceOf(ApiError);
        });

    });

});
