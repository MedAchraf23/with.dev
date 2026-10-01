import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CandidateProfileForm from '@/features/candidat/components/CandidateProfileForm.tsx';
import { EMPTY_PROFILE_FORM } from '@/features/candidat/interfaces/candidate.type.ts';
import { ContractType, WorkMode } from '@/types/common.type.ts';

describe('CandidateProfileForm - Unit', (): void => {

    const onSave = vi.fn();

    beforeEach((): void => {
        vi.clearAllMocks();
        onSave.mockResolvedValue(undefined);
    });

    afterEach((): void => {
        cleanup();
    });

    describe('Rendering', (): void => {

        it('should render the four sections of the form', (): void => {
            render(<CandidateProfileForm initialValues={EMPTY_PROFILE_FORM} onSave={onSave} saving={false} />);

            expect(screen.getByText('Identité')).toBeInTheDocument();
            expect(screen.getByText('Présentation')).toBeInTheDocument();
            expect(screen.getByText('Liens')).toBeInTheDocument();
            expect(screen.getByText('Votre recherche')).toBeInTheDocument();
        });

        it('should prefill the fields with the given values', (): void => {
            render(
                <CandidateProfileForm
                    initialValues={{ ...EMPTY_PROFILE_FORM, firstName: 'Jean', city: 'Mulhouse' }}
                    onSave={onSave}
                    saving={false}
                />
            );

            expect(screen.getByLabelText(/Prénom/)).toHaveValue('Jean');
            expect(screen.getByLabelText('Ville')).toHaveValue('Mulhouse');
        });

    });

    describe('Validation', (): void => {

        it('should not save while the first name and the last name are missing', async (): Promise<void> => {
            render(<CandidateProfileForm initialValues={EMPTY_PROFILE_FORM} onSave={onSave} saving={false} />);

            await userEvent.click(screen.getByRole('button', { name: 'Enregistrer mon profil' }));

            expect(onSave).not.toHaveBeenCalled();
        });

        it('should tell the user which identity fields are required', async (): Promise<void> => {
            render(<CandidateProfileForm initialValues={EMPTY_PROFILE_FORM} onSave={onSave} saving={false} />);

            await userEvent.click(screen.getByRole('button', { name: 'Enregistrer mon profil' }));

            expect(await screen.findByRole('alert')).toHaveTextContent('Prénom requis, Nom requis');
        });

        it('should clear the message once the required fields are filled', async (): Promise<void> => {
            render(<CandidateProfileForm initialValues={EMPTY_PROFILE_FORM} onSave={onSave} saving={false} />);

            await userEvent.click(screen.getByRole('button', { name: 'Enregistrer mon profil' }));
            expect(await screen.findByRole('alert')).toBeInTheDocument();

            await userEvent.type(screen.getByLabelText(/Prénom/), 'Jean');
            await userEvent.type(screen.getByLabelText(/Nom/), 'Dupont');
            await userEvent.click(screen.getByRole('button', { name: 'Enregistrer mon profil' }));

            expect(screen.queryByRole('alert')).not.toBeInTheDocument();
            expect(onSave).toHaveBeenCalled();
        });

    });

    describe('Save', (): void => {

        it('should save the typed values', async (): Promise<void> => {
            render(<CandidateProfileForm initialValues={EMPTY_PROFILE_FORM} onSave={onSave} saving={false} />);

            await userEvent.type(screen.getByLabelText(/Prénom/), 'Jean');
            await userEvent.type(screen.getByLabelText(/Nom/), 'Dupont');
            await userEvent.type(screen.getByLabelText('Ville'), 'Mulhouse');
            await userEvent.click(screen.getByRole('button', { name: 'Enregistrer mon profil' }));

            expect(onSave).toHaveBeenCalledWith(
                expect.objectContaining({ firstName: 'Jean', lastName: 'Dupont', city: 'Mulhouse' })
            );
        });

        it('should save the preferred contract types and work mode', async (): Promise<void> => {
            render(
                <CandidateProfileForm
                    initialValues={{ ...EMPTY_PROFILE_FORM, firstName: 'Jean', lastName: 'Dupont' }}
                    onSave={onSave}
                    saving={false}
                />
            );

            await userEvent.click(screen.getByRole('button', { name: /Types de contrat souhaités/ }));
            await userEvent.click(await screen.findByRole('option', { name: 'Alternance' }));

            await userEvent.click(screen.getByRole('button', { name: /Mode de travail souhaité/ }));
            await userEvent.click(await screen.findByRole('option', { name: 'Hybride' }));

            await userEvent.click(screen.getByRole('button', { name: 'Enregistrer mon profil' }));

            expect(onSave).toHaveBeenCalledWith(
                expect.objectContaining({
                    preferredContractTypes: [ContractType.ALTERNANCE],
                    preferredWorkMode: WorkMode.HYBRID,
                })
            );
        });

        it('should disable the button while saving', (): void => {
            render(<CandidateProfileForm initialValues={EMPTY_PROFILE_FORM} onSave={onSave} saving={true} />);

            expect(screen.getByRole('button', { name: /Enregistrer mon profil/ })).toBeDisabled();
        });

    });

});
