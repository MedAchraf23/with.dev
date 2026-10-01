import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ProfilPage from '@/presentation/pages/Profil/ProfilPage.tsx';
import { useCandidateProfile } from '@/features/candidat/hooks/use-candidate-profile.hook.ts';
import { CandidateProfile } from '@/features/candidat/interfaces/candidate.type.ts';

vi.mock('@/features/candidat/hooks/use-candidate-profile.hook', () => ({
    useCandidateProfile: vi.fn(),
}));

const aProfile = { firstName: 'Jean', lastName: 'Dupont', isOpenToWork: true } as CandidateProfile;

function givenHookState(state: Partial<ReturnType<typeof useCandidateProfile>>): void {
    vi.mocked(useCandidateProfile).mockReturnValue({
        profile: null,
        loading: false,
        saving: false,
        error: null,
        save: vi.fn(),
        ...state,
    });
}

describe('ProfilPage - Unit', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    afterEach((): void => {
        cleanup();
    });

    it('should render the form once the profile is loaded', (): void => {
        givenHookState({ profile: aProfile });

        render(<ProfilPage />);

        expect(screen.getByRole('button', { name: 'Enregistrer mon profil' })).toBeInTheDocument();
        expect(screen.getByLabelText(/Prénom/)).toHaveValue('Jean');
    });

    it('should invite the candidate to complete a profile that does not exist yet', (): void => {
        givenHookState({ profile: null });

        render(<ProfilPage />);

        expect(screen.getByText(/Complétez votre profil/)).toBeInTheDocument();
    });

    it('should invite the candidate to keep an existing profile up to date', (): void => {
        givenHookState({ profile: aProfile });

        render(<ProfilPage />);

        expect(screen.getByText(/Tenez vos informations à jour/)).toBeInTheDocument();
    });

    it('should not render the form while loading', (): void => {
        givenHookState({ loading: true });

        render(<ProfilPage />);

        expect(screen.queryByRole('button', { name: 'Enregistrer mon profil' })).not.toBeInTheDocument();
    });

    it('should render the error returned by the hook', (): void => {
        givenHookState({ error: "L'URL du CV doit être valide" });

        render(<ProfilPage />);

        expect(screen.getByText("L'URL du CV doit être valide")).toBeInTheDocument();
    });

});
