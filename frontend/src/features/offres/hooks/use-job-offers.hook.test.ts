import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useJobOffers } from "@/features/offres/hooks/use-job-offers.hook.ts";
import JobOfferService from "@/features/offres/services/job-offer.service.ts";
import {
    ContractType,
    EMPTY_CRITERIA,
    JobOffer,
    WorkMode,
} from "@/features/offres/interfaces/job-offer.type.ts";

vi.mock('@/features/offres/services/job-offer.service', () => ({
    default: {
        search: vi.fn(),
    },
}));

const anOffer = { id: 1, title: 'Développeur Java' } as JobOffer;

describe('useJobOffers - Unit', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
        vi.mocked(JobOfferService.search).mockResolvedValue([]);
    });

    describe('Initial load', (): void => {

        it('should load the offers without any criterion on mount', async (): Promise<void> => {
            vi.mocked(JobOfferService.search).mockResolvedValue([anOffer]);

            const { result } = renderHook(() => useJobOffers());

            await waitFor((): void => expect(result.current.loading).toBe(false));

            expect(JobOfferService.search).toHaveBeenCalledWith(EMPTY_CRITERIA);
            expect(result.current.offers).toEqual([anOffer]);
            expect(result.current.error).toBeNull();
        });

        it('should start in a loading state', (): void => {
            const { result } = renderHook(() => useJobOffers());

            expect(result.current.loading).toBe(true);
        });

    });

    describe('Search', (): void => {

        it('should forward the given criteria to the service', async (): Promise<void> => {
            const { result } = renderHook(() => useJobOffers());
            await waitFor((): void => expect(result.current.loading).toBe(false));

            const criteria = {
                search: 'java',
                city: 'Mulhouse',
                contractType: ContractType.CDI,
                workMode: WorkMode.HYBRID,
            };

            await act(async (): Promise<void> => {
                await result.current.search(criteria);
            });

            expect(JobOfferService.search).toHaveBeenLastCalledWith(criteria);
        });

        it('should replace the offers with the search results', async (): Promise<void> => {
            const { result } = renderHook(() => useJobOffers());
            await waitFor((): void => expect(result.current.loading).toBe(false));

            vi.mocked(JobOfferService.search).mockResolvedValue([anOffer]);

            await act(async (): Promise<void> => {
                await result.current.search(EMPTY_CRITERIA);
            });

            expect(result.current.offers).toEqual([anOffer]);
        });

    });

    describe('Error handling', (): void => {

        it('should expose an error message when the service fails', async (): Promise<void> => {
            vi.mocked(JobOfferService.search).mockRejectedValue(new Error('network'));

            const { result } = renderHook(() => useJobOffers());

            await waitFor((): void => expect(result.current.loading).toBe(false));

            expect(result.current.error).toBe(
                "Les offres n'ont pas pu être chargées. Vérifiez que le serveur est démarré."
            );
        });

        it('should clear the previously loaded offers on failure', async (): Promise<void> => {
            vi.mocked(JobOfferService.search).mockResolvedValue([anOffer]);
            const { result } = renderHook(() => useJobOffers());
            await waitFor((): void => expect(result.current.offers).toHaveLength(1));

            vi.mocked(JobOfferService.search).mockRejectedValue(new Error('network'));

            await act(async (): Promise<void> => {
                await result.current.search(EMPTY_CRITERIA);
            });

            expect(result.current.offers).toEqual([]);
        });

        it('should reset the error on a new successful search', async (): Promise<void> => {
            vi.mocked(JobOfferService.search).mockRejectedValue(new Error('network'));
            const { result } = renderHook(() => useJobOffers());
            await waitFor((): void => expect(result.current.error).not.toBeNull());

            vi.mocked(JobOfferService.search).mockResolvedValue([anOffer]);

            await act(async (): Promise<void> => {
                await result.current.search(EMPTY_CRITERIA);
            });

            expect(result.current.error).toBeNull();
        });

    });

});
