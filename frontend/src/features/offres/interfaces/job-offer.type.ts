import { ContractType, WorkMode } from '@/types/common.type.ts';

export enum ExperienceLevel {
    JUNIOR = "JUNIOR",
    INTERMEDIATE = "INTERMEDIATE",
    SENIOR = "SENIOR",
    LEAD = "LEAD",
}

export interface JobOffer {
    id: number;
    title: string;
    description: string;
    contractType: ContractType;
    experienceLevel: ExperienceLevel | null;
    salaryMin: number | null;
    salaryMax: number | null;
    tjmMin: number | null;
    tjmMax: number | null;
    city: string | null;
    workMode: WorkMode;
    publishedAt: string | null;
    companyId: number;
    companyName: string;
    companyLogoUrl: string | null;
}

export interface JobOfferSearchCriteria {
    search: string;
    city: string;
    contractType: ContractType | "";
    workMode: WorkMode | "";
}

export const EMPTY_CRITERIA: JobOfferSearchCriteria = {
    search: "",
    city: "",
    contractType: "",
    workMode: "",
};

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
    [ExperienceLevel.JUNIOR]: "Junior",
    [ExperienceLevel.INTERMEDIATE]: "Confirmé",
    [ExperienceLevel.SENIOR]: "Senior",
    [ExperienceLevel.LEAD]: "Lead",
};
