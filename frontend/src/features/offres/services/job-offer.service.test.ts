// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from 'vitest';
import JobOfferService from './job-offer.service.ts';
import BackendApi from '@/infrastructure/api/backend.api.ts';
import { EMPTY_CRITERIA } from '@/features/offres/interfaces/job-offer.type.ts';
import { ContractType, WorkMode } from '@/types/common.type.ts';

vi.mock('@/infrastructure/api/backend.api', () => ({
    default: {
        get: vi.fn(),
    },
}));

describe('JobOfferService - unit', (): void => {

    beforeEach(() => vi.clearAllMocks());

    describe('search', (): void => {

        it('should call the job offers endpoint and return the offers', async (): Promise<void> => {
            const offers = [{ id: 1, title: 'Développeur Java' }];
            vi.mocked(BackendApi.get).mockResolvedValue(offers as any);

            const result = await JobOfferService.search(EMPTY_CRITERIA);

            expect(result).toEqual(offers);
            expect(BackendApi.get).toHaveBeenCalledWith('/job-offers', expect.anything());
        });

        it('should forward every criterion to the api', async (): Promise<void> => {
            vi.mocked(BackendApi.get).mockResolvedValue([] as any);

            await JobOfferService.search({
                search: 'java',
                city: 'Mulhouse',
                contractType: ContractType.CDI,
                workMode: WorkMode.HYBRID,
            });

            expect(BackendApi.get).toHaveBeenCalledWith('/job-offers', {
                search: 'java',
                city: 'Mulhouse',
                contractType: 'CDI',
                workMode: 'HYBRID',
            });
        });

        it('should forward empty criteria as empty strings so the client drops them', async (): Promise<void> => {
            vi.mocked(BackendApi.get).mockResolvedValue([] as any);

            await JobOfferService.search(EMPTY_CRITERIA);

            expect(BackendApi.get).toHaveBeenCalledWith('/job-offers', {
                search: '',
                city: '',
                contractType: '',
                workMode: '',
            });
        });

    });

});
