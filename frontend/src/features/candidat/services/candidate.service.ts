import BackendApi, { ApiError } from '@/infrastructure/api/backend.api.ts';
import { toPayload } from '@/features/candidat/services/candidate.mapper.ts';
import {
    CandidateProfile,
    CandidateProfileFormValues,
} from '@/features/candidat/interfaces/candidate.type.ts';

const CandidateService = {

    async getMyProfile(): Promise<CandidateProfile | null> {
        try {
            return await BackendApi.get<CandidateProfile>('/candidates/me');
        } catch (error: unknown) {
            if (error instanceof ApiError && error.status === 404) {
                return null;
            }
            throw error;
        }
    },

    async create(values: CandidateProfileFormValues): Promise<CandidateProfile> {
        return BackendApi.post<CandidateProfile>('/candidates', toPayload(values));
    },

    async update(values: CandidateProfileFormValues): Promise<CandidateProfile> {
        return BackendApi.patch<CandidateProfile>('/candidates/me', toPayload(values));
    },

};

export default CandidateService;
