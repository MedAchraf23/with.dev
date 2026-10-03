import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AppNavbar from '@/presentation/components/AppNavbar.tsx';
import { useAuth } from '@/features/authentification/hooks/use-auth.hook.ts';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/features/authentification/hooks/use-auth.hook', () => ({
    useAuth: vi.fn(),
}));

const signOut = vi.fn();

function renderNavbar(route: string = '/offres'): void {
    render(
        <MemoryRouter initialEntries={[route]}>
            <AppNavbar />
        </MemoryRouter>
    );
}

describe('AppNavbar - Unit', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
        signOut.mockResolvedValue(undefined);
        vi.mocked(useAuth).mockReturnValue({ signOut } as unknown as ReturnType<typeof useAuth>);
    });

    afterEach((): void => {
        cleanup();
    });

    describe('Rendering', (): void => {

        it('should render the brand and the navigation links', (): void => {
            renderNavbar();

            expect(screen.getByText('with.dev')).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Offres' })).toBeInTheDocument();
            expect(screen.getByRole('link', { name: 'Mon profil' })).toBeInTheDocument();
        });

        it('should point the links to their pages', (): void => {
            renderNavbar();

            expect(screen.getByRole('link', { name: 'Offres' })).toHaveAttribute('href', '/offres');
            expect(screen.getByRole('link', { name: 'Mon profil' })).toHaveAttribute('href', '/profil');
        });

    });

    describe('Current page', (): void => {

        it('should mark the offers link as current when on the offers page', (): void => {
            renderNavbar('/offres');

            expect(screen.getByRole('link', { name: 'Offres' })).toHaveAttribute('aria-current', 'page');
            expect(screen.getByRole('link', { name: 'Mon profil' })).not.toHaveAttribute('aria-current');
        });

        it('should mark the profile link as current when on the profile page', (): void => {
            renderNavbar('/profil');

            expect(screen.getByRole('link', { name: 'Mon profil' })).toHaveAttribute('aria-current', 'page');
            expect(screen.getByRole('link', { name: 'Offres' })).not.toHaveAttribute('aria-current');
        });

    });

    describe('Sign out', (): void => {

        it('should sign the user out and send them back to the authentication page', async (): Promise<void> => {
            renderNavbar();

            await userEvent.click(screen.getByRole('button', { name: 'Se déconnecter' }));

            await waitFor((): void => {
                expect(signOut).toHaveBeenCalledTimes(1);
                expect(mockNavigate).toHaveBeenCalledWith('/auth', { replace: true });
            });
        });

    });

});
