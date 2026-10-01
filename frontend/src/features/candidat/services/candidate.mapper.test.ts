// @vitest-environment node

import { describe, it, expect } from 'vitest';
import { toFormValues, toPayload } from '@/features/candidat/services/candidate.mapper.ts';
import {
    CandidateProfile,
    EMPTY_PROFILE_FORM,
} from '@/features/candidat/interfaces/candidate.type.ts';
import { ContractType, WorkMode } from '@/types/common.type.ts';

function aProfile(overrides: Partial<CandidateProfile> = {}): CandidateProfile {
    return {
        id: 1,
        userId: 'c0ffee00-0000-0000-0000-000000000000',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@mail.com',
        headline: null,
        phone: null,
        city: null,
        bio: null,
        cvUrl: null,
        photoUrl: null,
        linkedinUrl: null,
        githubUrl: null,
        yearsOfExperience: null,
        desiredSalaryMin: null,
        desiredSalaryMax: null,
        desiredTjmMin: null,
        desiredTjmMax: null,
        preferredWorkMode: null,
        preferredContractTypes: null,
        isOpenToWork: true,
        createdAt: '2026-01-01T00:00:00Z',
        ...overrides,
    };
}

describe('candidate mapper - Unit', (): void => {

    describe('toFormValues', (): void => {

        it('should return an empty form when there is no profile yet', (): void => {
            expect(toFormValues(null)).toEqual(EMPTY_PROFILE_FORM);
        });

        it('should turn missing optional values into empty fields', (): void => {
            const values = toFormValues(aProfile());

            expect(values.headline).toBe('');
            expect(values.yearsOfExperience).toBe('');
            expect(values.preferredWorkMode).toBe('');
            expect(values.preferredContractTypes).toEqual([]);
        });

        it('should fill the form with the values of an existing profile', (): void => {
            const values = toFormValues(aProfile({
                city: 'Mulhouse',
                yearsOfExperience: 3,
                desiredSalaryMin: 38000,
                preferredWorkMode: WorkMode.HYBRID,
                preferredContractTypes: [ContractType.CDI, ContractType.ALTERNANCE],
                isOpenToWork: false,
            }));

            expect(values.firstName).toBe('Jean');
            expect(values.city).toBe('Mulhouse');
            expect(values.yearsOfExperience).toBe('3');
            expect(values.desiredSalaryMin).toBe('38000');
            expect(values.preferredWorkMode).toBe(WorkMode.HYBRID);
            expect(values.preferredContractTypes).toEqual([ContractType.CDI, ContractType.ALTERNANCE]);
            expect(values.isOpenToWork).toBe(false);
        });

    });

    describe('toPayload', (): void => {

        it('should omit the fields left empty rather than sending empty strings', (): void => {
            const payload = toPayload({ ...EMPTY_PROFILE_FORM, firstName: 'Jean', lastName: 'Dupont' });

            expect(payload.firstName).toBe('Jean');
            expect(payload.headline).toBeUndefined();
            expect(payload.city).toBeUndefined();
            expect(payload.cvUrl).toBeUndefined();
            expect(payload.preferredWorkMode).toBeUndefined();
        });

        it('should drop the omitted fields once serialised', (): void => {
            const payload = toPayload({ ...EMPTY_PROFILE_FORM, firstName: 'Jean', lastName: 'Dupont' });

            expect(JSON.parse(JSON.stringify(payload))).not.toHaveProperty('headline');
        });

        it('should trim the text values', (): void => {
            const payload = toPayload({ ...EMPTY_PROFILE_FORM, firstName: '  Jean  ', city: '  Mulhouse  ' });

            expect(payload.firstName).toBe('Jean');
            expect(payload.city).toBe('Mulhouse');
        });

        it('should convert the numeric fields into numbers', (): void => {
            const payload = toPayload({
                ...EMPTY_PROFILE_FORM,
                yearsOfExperience: '3',
                desiredSalaryMin: '38000',
                desiredSalaryMax: '45000',
            });

            expect(payload.yearsOfExperience).toBe(3);
            expect(payload.desiredSalaryMin).toBe(38000);
            expect(payload.desiredSalaryMax).toBe(45000);
        });

        it('should always send the contract types and the availability', (): void => {
            const payload = toPayload({
                ...EMPTY_PROFILE_FORM,
                preferredContractTypes: [ContractType.CDI],
                isOpenToWork: false,
            });

            expect(payload.preferredContractTypes).toEqual([ContractType.CDI]);
            expect(payload.isOpenToWork).toBe(false);
        });

    });

});
