export enum ContractType {
    CDI = "CDI",
    CDD = "CDD",
    FREELANCE = "FREELANCE",
    STAGE = "STAGE",
    ALTERNANCE = "ALTERNANCE",
}

export enum WorkMode {
    ON_SITE = "ON_SITE",
    HYBRID = "HYBRID",
    FULL_REMOTE = "FULL_REMOTE",
}

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

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
    [ContractType.CDI]: "CDI",
    [ContractType.CDD]: "CDD",
    [ContractType.FREELANCE]: "Freelance",
    [ContractType.STAGE]: "Stage",
    [ContractType.ALTERNANCE]: "Alternance",
};

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
    [WorkMode.ON_SITE]: "Sur site",
    [WorkMode.HYBRID]: "Hybride",
    [WorkMode.FULL_REMOTE]: "Télétravail total",
};

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
    [ExperienceLevel.JUNIOR]: "Junior",
    [ExperienceLevel.INTERMEDIATE]: "Confirmé",
    [ExperienceLevel.SENIOR]: "Senior",
    [ExperienceLevel.LEAD]: "Lead",
};
