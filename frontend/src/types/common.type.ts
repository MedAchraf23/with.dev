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
