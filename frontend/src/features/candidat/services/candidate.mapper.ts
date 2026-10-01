import {
    CandidateProfile,
    CandidateProfileFormValues,
    EMPTY_PROFILE_FORM,
} from '@/features/candidat/interfaces/candidate.type.ts';

function textOrUndefined(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
}

function numberOrUndefined(value: string): number | undefined {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : Number(trimmed);
}

function textOrEmpty(value: string | null): string {
    return value ?? '';
}

function numberOrEmpty(value: number | null): string {
    return value === null ? '' : String(value);
}

export function toFormValues(profile: CandidateProfile | null): CandidateProfileFormValues {
    if (profile === null) {
        return EMPTY_PROFILE_FORM;
    }

    return {
        firstName: profile.firstName,
        lastName: profile.lastName,
        headline: textOrEmpty(profile.headline),
        phone: textOrEmpty(profile.phone),
        city: textOrEmpty(profile.city),
        bio: textOrEmpty(profile.bio),
        cvUrl: textOrEmpty(profile.cvUrl),
        linkedinUrl: textOrEmpty(profile.linkedinUrl),
        githubUrl: textOrEmpty(profile.githubUrl),
        yearsOfExperience: numberOrEmpty(profile.yearsOfExperience),
        desiredSalaryMin: numberOrEmpty(profile.desiredSalaryMin),
        desiredSalaryMax: numberOrEmpty(profile.desiredSalaryMax),
        preferredWorkMode: profile.preferredWorkMode ?? '',
        preferredContractTypes: profile.preferredContractTypes ?? [],
        isOpenToWork: profile.isOpenToWork,
    };
}

/**
 * Les champs laissés vides sont omis plutôt qu'envoyés à vide : l'API rejette
 * les chaînes vides sur la mise à jour partielle.
 */
export function toPayload(values: CandidateProfileFormValues): Record<string, unknown> {
    return {
        firstName: textOrUndefined(values.firstName),
        lastName: textOrUndefined(values.lastName),
        headline: textOrUndefined(values.headline),
        phone: textOrUndefined(values.phone),
        city: textOrUndefined(values.city),
        bio: textOrUndefined(values.bio),
        cvUrl: textOrUndefined(values.cvUrl),
        linkedinUrl: textOrUndefined(values.linkedinUrl),
        githubUrl: textOrUndefined(values.githubUrl),
        yearsOfExperience: numberOrUndefined(values.yearsOfExperience),
        desiredSalaryMin: numberOrUndefined(values.desiredSalaryMin),
        desiredSalaryMax: numberOrUndefined(values.desiredSalaryMax),
        preferredWorkMode: values.preferredWorkMode === '' ? undefined : values.preferredWorkMode,
        preferredContractTypes: values.preferredContractTypes,
        isOpenToWork: values.isOpenToWork,
    };
}
