import { useCallback, useEffect, useState } from 'react';
import { addToast } from '@heroui/toast';
import CandidateService from '@/features/candidat/services/candidate.service.ts';
import { ApiError } from '@/infrastructure/api/backend.api.ts';
import {
    CandidateProfile,
    CandidateProfileFormValues,
} from '@/features/candidat/interfaces/candidate.type.ts';

interface UseCandidateProfile {
    profile: CandidateProfile | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    save: (values: CandidateProfileFormValues) => Promise<void>;
}

export function useCandidateProfile(): UseCandidateProfile {
    const [profile, setProfile] = useState<CandidateProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect((): void => {
        void (async (): Promise<void> => {
            try {
                setProfile(await CandidateService.getMyProfile());
            } catch {
                setError("Votre profil n'a pas pu être chargé. Vérifiez que le serveur est démarré.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const save = useCallback(async (values: CandidateProfileFormValues): Promise<void> => {
        setSaving(true);
        setError(null);

        try {
            const saved = profile === null
                ? await CandidateService.create(values)
                : await CandidateService.update(values);

            setProfile(saved);
            addToast({
                title: 'Profil enregistré',
                color: 'success',
                timeout: 3000,
            });
        } catch (err: unknown) {
            setError(err instanceof ApiError ? err.message : "L'enregistrement a échoué.");
        } finally {
            setSaving(false);
        }
    }, [profile]);

    return { profile, loading, saving, error, save };
}
