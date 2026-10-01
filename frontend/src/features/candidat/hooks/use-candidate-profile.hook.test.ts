import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { addToast } from '@heroui/toast';
import { useCandidateProfile } from '@/features/candidat/hooks/use-candidate-profile.hook.ts';
import CandidateService from '@/features/candidat/services/candidate.service.ts';
import { ApiError } from '@/infrastructure/api/backend.api.ts';
import {
    CandidateProfile,
    EMPTY_PROFILE_FORM,
} from '@/features/candidat/interfaces/candidate.type.ts';

vi.mock('@/features/candidat/services/candidate.service', () => ({
    default: {
        getMyProfile: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
}));

vi.mock('@heroui/toast', () => ({
    addToast: vi.fn(),
}));

const aProfile = { id: 1, firstName: 'Jean' } as CandidateProfile;

describe('useCandidateProfile - Unit', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
        vi.mocked(CandidateService.getMyProfile).mockResolvedValue(null);
    });

    describe('Initial load', (): void => {

        it('should load the existing profile', async (): Promise<void> => {
            vi.mocked(CandidateService.getMyProfile).mockResolvedValue(aProfile);

            const { result } = renderHook(() => useCandidateProfile());

            await waitFor((): void => expect(result.current.loading).toBe(false));

            expect(result.current.profile).toEqual(aProfile);
        });

        it('should leave the profile empty when the candidate has none yet', async (): Promise<void> => {
            const { result } = renderHook(() => useCandidateProfile());

            await waitFor((): void => expect(result.current.loading).toBe(false));

            expect(result.current.profile).toBeNull();
            expect(result.current.error).toBeNull();
        });

        it('should expose an error message when the loading fails', async (): Promise<void> => {
            vi.mocked(CandidateService.getMyProfile).mockRejectedValue(new Error('network'));

            const { result } = renderHook(() => useCandidateProfile());

            await waitFor((): void => expect(result.current.loading).toBe(false));

            expect(result.current.error).toBe(
                "Votre profil n'a pas pu être chargé. Vérifiez que le serveur est démarré."
            );
        });

    });

    describe('Save', (): void => {

        it('should create the profile when there is none yet', async (): Promise<void> => {
            vi.mocked(CandidateService.create).mockResolvedValue(aProfile);
            const { result } = renderHook(() => useCandidateProfile());
            await waitFor((): void => expect(result.current.loading).toBe(false));

            await act(async (): Promise<void> => {
                await result.current.save(EMPTY_PROFILE_FORM);
            });

            expect(CandidateService.create).toHaveBeenCalledWith(EMPTY_PROFILE_FORM);
            expect(CandidateService.update).not.toHaveBeenCalled();
            expect(result.current.profile).toEqual(aProfile);
        });

        it('should update the profile when it already exists', async (): Promise<void> => {
            vi.mocked(CandidateService.getMyProfile).mockResolvedValue(aProfile);
            vi.mocked(CandidateService.update).mockResolvedValue(aProfile);
            const { result } = renderHook(() => useCandidateProfile());
            await waitFor((): void => expect(result.current.loading).toBe(false));

            await act(async (): Promise<void> => {
                await result.current.save(EMPTY_PROFILE_FORM);
            });

            expect(CandidateService.update).toHaveBeenCalledWith(EMPTY_PROFILE_FORM);
            expect(CandidateService.create).not.toHaveBeenCalled();
        });

        it('should notify the user once the profile is saved', async (): Promise<void> => {
            vi.mocked(CandidateService.create).mockResolvedValue(aProfile);
            const { result } = renderHook(() => useCandidateProfile());
            await waitFor((): void => expect(result.current.loading).toBe(false));

            await act(async (): Promise<void> => {
                await result.current.save(EMPTY_PROFILE_FORM);
            });

            expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ color: 'success' }));
        });

        it('should surface the message returned by the api when the save fails', async (): Promise<void> => {
            vi.mocked(CandidateService.create).mockRejectedValue(
                new ApiError(400, "L'URL du CV doit être valide")
            );
            const { result } = renderHook(() => useCandidateProfile());
            await waitFor((): void => expect(result.current.loading).toBe(false));

            await act(async (): Promise<void> => {
                await result.current.save(EMPTY_PROFILE_FORM);
            });

            expect(result.current.error).toBe("L'URL du CV doit être valide");
            expect(result.current.saving).toBe(false);
        });

    });

});
