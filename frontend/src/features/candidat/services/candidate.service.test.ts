// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';
import CandidateService from '@/features/candidat/services/candidate.service.ts';
import BackendApi, { ApiError } from '@/infrastructure/api/backend.api.ts';
import { EMPTY_PROFILE_FORM } from '@/features/candidat/interfaces/candidate.type.ts';

vi.mock('@/infrastructure/api/backend.api', async () => {
    const actual = await vi.importActual<typeof import('@/infrastructure/api/backend.api.ts')>(
        '@/infrastructure/api/backend.api.ts'
    );
    return {
        ApiError: actual.ApiError,
        default: {
            get: vi.fn(),
            post: vi.fn(),
            patch: vi.fn(),
        },
    };
});

describe('CandidateService - Unit', (): void => {

    beforeEach(() => vi.clearAllMocks());

    describe('getMyProfile', (): void => {

        it('should return the profile when it exists', async (): Promise<void> => {
            const profile = { id: 1, firstName: 'Jean' };
            vi.mocked(BackendApi.get).mockResolvedValue(profile as any);

            const result = await CandidateService.getMyProfile();

            expect(result).toEqual(profile);
            expect(BackendApi.get).toHaveBeenCalledWith('/candidates/me');
        });

        it('should return null when the candidate has no profile yet', async (): Promise<void> => {
            vi.mocked(BackendApi.get).mockRejectedValue(new ApiError(404, 'Profil candidat non trouvé'));

            const result = await CandidateService.getMyProfile();

            expect(result).toBeNull();
        });

        it('should rethrow any other failure', async (): Promise<void> => {
            vi.mocked(BackendApi.get).mockRejectedValue(new ApiError(500, 'Erreur interne.'));

            await expect(CandidateService.getMyProfile()).rejects.toThrowError(ApiError);
        });

    });

    describe('create', (): void => {

        it('should post the mapped payload', async (): Promise<void> => {
            vi.mocked(BackendApi.post).mockResolvedValue({} as any);

            await CandidateService.create({ ...EMPTY_PROFILE_FORM, firstName: 'Jean', lastName: 'Dupont' });

            expect(BackendApi.post).toHaveBeenCalledWith(
                '/candidates',
                expect.objectContaining({ firstName: 'Jean', lastName: 'Dupont' })
            );
        });

    });

    describe('update', (): void => {

        it('should patch the mapped payload', async (): Promise<void> => {
            vi.mocked(BackendApi.patch).mockResolvedValue({} as any);

            await CandidateService.update({ ...EMPTY_PROFILE_FORM, city: 'Mulhouse' });

            expect(BackendApi.patch).toHaveBeenCalledWith(
                '/candidates/me',
                expect.objectContaining({ city: 'Mulhouse' })
            );
        });

    });

});
