import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import JobOfferCard from "@/features/offres/components/JobOfferCard.tsx";
import {
    ContractType,
    ExperienceLevel,
    JobOffer,
    WorkMode,
} from "@/features/offres/interfaces/job-offer.type.ts";

function anOffer(overrides: Partial<JobOffer> = {}): JobOffer {
    return {
        id: 1,
        title: 'Développeur Java / Spring Boot',
        description: 'Vous rejoignez une équipe de six développeurs.',
        contractType: ContractType.CDI,
        experienceLevel: ExperienceLevel.INTERMEDIATE,
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
        ...overrides,
    };
}

describe('JobOfferCard - Unit', (): void => {

    afterEach((): void => {
        cleanup();
    });

    describe('Offer details', (): void => {

        it('should render the title, the company and the city', (): void => {
            render(<JobOfferCard offer={anOffer()} />);

            expect(screen.getByText('Développeur Java / Spring Boot')).toBeInTheDocument();
            expect(screen.getByText(/Alsatech/)).toBeInTheDocument();
            expect(screen.getByText(/Mulhouse/)).toBeInTheDocument();
        });

        it('should render the description', (): void => {
            render(<JobOfferCard offer={anOffer()} />);

            expect(screen.getByText('Vous rejoignez une équipe de six développeurs.')).toBeInTheDocument();
        });

        it('should render the first letter of the company as an avatar', (): void => {
            render(<JobOfferCard offer={anOffer({ companyName: 'NovaSoft' })} />);

            expect(screen.getByText('N')).toBeInTheDocument();
        });

    });

    describe('Labels', (): void => {

        it('should translate the contract type and the work mode into french', (): void => {
            render(<JobOfferCard offer={anOffer({
                contractType: ContractType.FREELANCE,
                workMode: WorkMode.FULL_REMOTE,
            })} />);

            expect(screen.getByText('Freelance')).toBeInTheDocument();
            expect(screen.getByText('Télétravail total')).toBeInTheDocument();
        });

        it('should render the experience level when it is known', (): void => {
            render(<JobOfferCard offer={anOffer({ experienceLevel: ExperienceLevel.LEAD })} />);

            expect(screen.getByText('Lead')).toBeInTheDocument();
        });

        it('should not render any experience level when it is missing', (): void => {
            render(<JobOfferCard offer={anOffer({ experienceLevel: null })} />);

            expect(screen.queryByText('Confirmé')).not.toBeInTheDocument();
        });

    });

    describe('Compensation', (): void => {

        it('should render a yearly salary range when a salary is set', (): void => {
            render(<JobOfferCard offer={anOffer()} />);

            expect(screen.getByText(/brut \/ an/)).toBeInTheDocument();
        });

        it('should render a daily rate when the offer is paid by day', (): void => {
            render(<JobOfferCard offer={anOffer({
                salaryMin: null,
                salaryMax: null,
                tjmMin: 500,
                tjmMax: 650,
            })} />);

            expect(screen.getByText(/€ \/ jour/)).toBeInTheDocument();
        });

        it('should state that the compensation is unknown when nothing is set', (): void => {
            render(<JobOfferCard offer={anOffer({
                salaryMin: null,
                salaryMax: null,
                tjmMin: null,
                tjmMax: null,
            })} />);

            expect(screen.getByText('Rémunération non précisée')).toBeInTheDocument();
        });

    });

    describe('Publication date', (): void => {

        it('should render a relative date for an offer published days ago', (): void => {
            const fiveDaysAgo = new Date(Date.now() - 5 * 86_400_000).toISOString();

            render(<JobOfferCard offer={anOffer({ publishedAt: fiveDaysAgo })} />);

            expect(screen.getByText('Publiée il y a 5 jours')).toBeInTheDocument();
        });

        it('should render a dedicated wording for an offer published today', (): void => {
            render(<JobOfferCard offer={anOffer({ publishedAt: new Date().toISOString() })} />);

            expect(screen.getByText("Publiée aujourd'hui")).toBeInTheDocument();
        });

    });

});
