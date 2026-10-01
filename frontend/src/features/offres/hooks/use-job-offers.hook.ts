import { useCallback, useEffect, useState } from 'react';
import JobOfferService from '@/features/offres/services/job-offer.service.ts';
import {
    EMPTY_CRITERIA,
    JobOffer,
    JobOfferSearchCriteria,
} from '@/features/offres/interfaces/job-offer.type.ts';

interface UseJobOffers {
    offers: JobOffer[];
    loading: boolean;
    error: string | null;
    search: (criteria: JobOfferSearchCriteria) => Promise<void>;
}

export function useJobOffers(): UseJobOffers {
    const [offers, setOffers] = useState<JobOffer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (criteria: JobOfferSearchCriteria): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            setOffers(await JobOfferService.search(criteria));
        } catch {
            setError("Les offres n'ont pas pu être chargées. Vérifiez que le serveur est démarré.");
            setOffers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect((): void => {
        void search(EMPTY_CRITERIA);
    }, [search]);

    return { offers, loading, error, search };
}
