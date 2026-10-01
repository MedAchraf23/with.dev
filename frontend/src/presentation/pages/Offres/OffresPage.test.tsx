import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import OffresPage from "@/presentation/pages/Offres/OffresPage.tsx";
import { useJobOffers } from "@/features/offres/hooks/use-job-offers.hook.ts";
import { JobOffer } from '@/features/offres/interfaces/job-offer.type.ts';
import { ContractType, WorkMode } from '@/types/common.type.ts';

vi.mock('@/features/offres/hooks/use-job-offers.hook', () => ({
    useJobOffers: vi.fn(),
}));

const anOffer: JobOffer = {
    id: 1,
    title: 'Développeur Java / Spring Boot',
    description: 'Une équipe de six développeurs.',
    contractType: ContractType.CDI,
    experienceLevel: null,
    salaryMin: 42000,
    salaryMax: 52000,
    tjmMin: null,
    tjmMax: null,
    city: 'Mulhouse',
    workMode: WorkMode.HYBRID,
    publishedAt: new Date().toISOString(),
    companyId: 1,
    companyName: 'Alsatech',
    companyLogoUrl: null,
};

function givenHookState(state: Partial<ReturnType<typeof useJobOffers>>): void {
    vi.mocked(useJobOffers).mockReturnValue({
        offers: [],
        loading: false,
        error: null,
        search: vi.fn(),
        ...state,
    });
}

describe('OffresPage - Unit', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    afterEach((): void => {
        cleanup();
    });

    it('should render the offers once they are loaded', (): void => {
        givenHookState({ offers: [anOffer] });

        render(<OffresPage />);

        expect(screen.getByText('Développeur Java / Spring Boot')).toBeInTheDocument();
        expect(screen.getByText('1 offre disponible')).toBeInTheDocument();
    });

    it('should tell the user when no offer matches the search', (): void => {
        givenHookState({ offers: [] });

        render(<OffresPage />);

        expect(screen.getByText('Aucune offre ne correspond à votre recherche')).toBeInTheDocument();
    });

    it('should render the error message when the loading failed', (): void => {
        givenHookState({ error: 'Les offres ne sont pas disponibles.' });

        render(<OffresPage />);

        expect(screen.getByText('Les offres ne sont pas disponibles.')).toBeInTheDocument();
        expect(screen.queryByText('Aucune offre ne correspond à votre recherche')).not.toBeInTheDocument();
    });

    it('should not render any offer while loading', (): void => {
        givenHookState({ loading: true, offers: [anOffer] });

        render(<OffresPage />);

        expect(screen.queryByText('Développeur Java / Spring Boot')).not.toBeInTheDocument();
    });

});
