import { ContractType, WorkMode } from '@/types/common.type.ts';

export interface CandidateProfile {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    headline: string | null;
    phone: string | null;
    city: string | null;
    bio: string | null;
    cvUrl: string | null;
    photoUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    yearsOfExperience: number | null;
    desiredSalaryMin: number | null;
    desiredSalaryMax: number | null;
    desiredTjmMin: number | null;
    desiredTjmMax: number | null;
    preferredWorkMode: WorkMode | null;
    preferredContractTypes: ContractType[] | null;
    isOpenToWork: boolean;
    createdAt: string;
}

export interface CandidateProfileFormValues {
    firstName: string;
    lastName: string;
    headline: string;
    phone: string;
    city: string;
    bio: string;
    cvUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    yearsOfExperience: string;
    desiredSalaryMin: string;
    desiredSalaryMax: string;
    preferredWorkMode: WorkMode | '';
    preferredContractTypes: ContractType[];
    isOpenToWork: boolean;
}

export const EMPTY_PROFILE_FORM: CandidateProfileFormValues = {
    firstName: '',
    lastName: '',
    headline: '',
    phone: '',
    city: '',
    bio: '',
    cvUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    yearsOfExperience: '',
    desiredSalaryMin: '',
    desiredSalaryMax: '',
    preferredWorkMode: '',
    preferredContractTypes: [],
    isOpenToWork: true,
};
