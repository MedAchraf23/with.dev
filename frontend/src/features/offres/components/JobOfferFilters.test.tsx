import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobOfferFilters from "@/features/offres/components/JobOfferFilters.tsx";
import { ContractType, WorkMode } from "@/features/offres/interfaces/job-offer.type.ts";

describe('JobOfferFilters - Unit', (): void => {

    const onSearch = vi.fn();

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    afterEach((): void => {
        cleanup();
    });

    describe('Rendering', (): void => {

        it('should render the keyword field, the city field and the submit button', (): void => {
            render(<JobOfferFilters onSearch={onSearch} loading={false} />);

            expect(screen.getByLabelText('Métier, technologie, mot-clé')).toBeInTheDocument();
            expect(screen.getByLabelText('Ville')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Rechercher' })).toBeInTheDocument();
        });

        it('should not search before the user submits', async (): Promise<void> => {
            render(<JobOfferFilters onSearch={onSearch} loading={false} />);

            await userEvent.type(screen.getByLabelText('Métier, technologie, mot-clé'), 'java');

            expect(onSearch).not.toHaveBeenCalled();
        });

    });

    describe('Submit', (): void => {

        it('should search with the typed keyword and city', async (): Promise<void> => {
            render(<JobOfferFilters onSearch={onSearch} loading={false} />);

            await userEvent.type(screen.getByLabelText('Métier, technologie, mot-clé'), 'java');
            await userEvent.type(screen.getByLabelText('Ville'), 'Mulhouse');
            await userEvent.click(screen.getByRole('button', { name: 'Rechercher' }));

            expect(onSearch).toHaveBeenCalledWith({
                search: 'java',
                city: 'Mulhouse',
                contractType: '',
                workMode: '',
            });
        });

        it('should search with empty criteria when nothing is filled', async (): Promise<void> => {
            render(<JobOfferFilters onSearch={onSearch} loading={false} />);

            await userEvent.click(screen.getByRole('button', { name: 'Rechercher' }));

            expect(onSearch).toHaveBeenCalledWith({
                search: '',
                city: '',
                contractType: '',
                workMode: '',
            });
        });

    });

    describe('Filters', (): void => {

        it('should search as soon as a contract type is picked', async (): Promise<void> => {
            render(<JobOfferFilters onSearch={onSearch} loading={false} />);

            await userEvent.click(screen.getByRole('button', { name: /Type de contrat/ }));
            await userEvent.click(await screen.findByRole('option', { name: 'Freelance' }));

            expect(onSearch).toHaveBeenCalledWith(
                expect.objectContaining({ contractType: ContractType.FREELANCE })
            );
        });

        it('should search as soon as a work mode is picked', async (): Promise<void> => {
            render(<JobOfferFilters onSearch={onSearch} loading={false} />);

            await userEvent.click(screen.getByRole('button', { name: /Mode de travail/ }));
            await userEvent.click(await screen.findByRole('option', { name: 'Télétravail total' }));

            expect(onSearch).toHaveBeenCalledWith(
                expect.objectContaining({ workMode: WorkMode.FULL_REMOTE })
            );
        });

        it('should clear the filter when the user picks the catch-all option', async (): Promise<void> => {
            render(<JobOfferFilters onSearch={onSearch} loading={false} />);

            await userEvent.click(screen.getByRole('button', { name: /Type de contrat/ }));
            await userEvent.click(await screen.findByRole('option', { name: 'Freelance' }));

            await userEvent.click(screen.getByRole('button', { name: /Type de contrat/ }));
            await userEvent.click(await screen.findByRole('option', { name: 'Tous les contrats' }));

            expect(onSearch).toHaveBeenLastCalledWith(
                expect.objectContaining({ contractType: '' })
            );
        });

    });

});
