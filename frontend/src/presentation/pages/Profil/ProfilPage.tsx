import { ReactNode } from 'react';
import { Spinner } from '@heroui/react';
import { Card, CardBody } from '@heroui/card';
import Heading from '@/presentation/components/Heading.tsx';
import CandidateProfileForm from '@/features/candidat/components/CandidateProfileForm.tsx';
import { useCandidateProfile } from '@/features/candidat/hooks/use-candidate-profile.hook.ts';
import { toFormValues } from '@/features/candidat/services/candidate.mapper.ts';

export default function ProfilPage(): ReactNode {
    const { profile, loading, saving, error, save } = useCandidateProfile();

    if (loading) {
        return (
            <div className="flex justify-center py-16">
                <Spinner label="Chargement de votre profil..." />
            </div>
        );
    }

    return (
        <section className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
            <header>
                <Heading level={2}>Mon profil</Heading>
                <p className="text-foreground-500 mt-1">
                    {profile === null
                        ? 'Complétez votre profil pour que les recruteurs puissent vous trouver.'
                        : 'Tenez vos informations à jour pour rester visible auprès des recruteurs.'}
                </p>
            </header>

            {error !== null && (
                <Card shadow="none" className="bg-danger-50">
                    <CardBody>
                        <p className="text-danger font-medium">{error}</p>
                    </CardBody>
                </Card>
            )}

            <CandidateProfileForm
                initialValues={toFormValues(profile)}
                onSave={save}
                saving={saving}
            />
        </section>
    );
}
