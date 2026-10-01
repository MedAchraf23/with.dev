import BackendApi from '@/infrastructure/api/backend.api.ts';
import { JobOffer, JobOfferSearchCriteria } from '@/features/offres/interfaces/job-offer.type.ts';

const JobOfferService = {

    async search(criteria: JobOfferSearchCriteria): Promise<JobOffer[]> {
        return BackendApi.get<JobOffer[]>('/job-offers', {
            search: criteria.search,
            city: criteria.city,
            contractType: criteria.contractType,
            workMode: criteria.workMode,
        });
    },

};

export default JobOfferService;
