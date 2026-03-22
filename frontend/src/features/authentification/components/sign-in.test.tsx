import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignIn from './SignIn.tsx';

const mockSignIn = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/features/authentification/hooks/use-auth.hook.ts', () => ({
    useAuth: () => ({ signIn: mockSignIn }),
}));

vi.mock('@heroui/toast', () => ({
    addToast: vi.fn(),
}));

const renderSignIn = () => {
    const user = userEvent.setup();
    render(
        <MemoryRouter>
            <SignIn />
        </MemoryRouter>
    );
    return { user };
};

const submitForm = async (): Promise<void> => {
    const button = screen.getByRole('button', { name: 'Se connecter' });
    await userEvent.click(button);
};

describe('SignIn Component - Unit', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
    });

    afterEach((): void => {
        cleanup();
    });

    it('should render the form', (): void => {
        renderSignIn();

        expect(screen.getAllByPlaceholderText('exemple@email.com')[0]).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText('Votre mot de passe')[0]).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    describe('valid field', (): void => {

        it('should show email required error on submit', async (): Promise<void> => {
            const { user } = renderSignIn();

            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], 'Password_123!');
            await submitForm();

            await waitFor((): void => {
                expect(screen.getByText('Email requis')).toBeInTheDocument();
            });
        });

        it('should show invalid email error', async (): Promise<void> => {
            const { user } = renderSignIn();

            const emailInput = screen.getAllByPlaceholderText('exemple@email.com')[0];
            await user.type(emailInput, 'invalid');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText('Email invalide')).toBeInTheDocument();
            });
        });

        it('should show password required error on submit', async (): Promise<void> => {
            const { user } = renderSignIn();

            await user.type(screen.getAllByPlaceholderText('exemple@email.com')[0], 'test@mail.com');
            await submitForm();

            await waitFor(() => {
                expect(screen.getByText('Mot de passe requis')).toBeInTheDocument();
            });
        });

        it('should show password too short error', async (): Promise<void> => {
            const { user } = renderSignIn();

            const passwordInput = screen.getAllByPlaceholderText('Votre mot de passe')[0];
            await user.type(passwordInput, '123');

            await waitFor(() => {
                expect(screen.getByText('12 caractères minimum')).toBeInTheDocument();
            });
        });

    });

    describe('email authentification', (): void => {

        it('should sign in and navigate on success', async (): Promise<void> => {
            mockSignIn.mockResolvedValue(undefined);
            const { addToast } = await import('@heroui/toast');
            const { user } = renderSignIn();

            await user.type(screen.getAllByPlaceholderText('exemple@email.com')[0], 'test@mail.com');
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], 'Password_123!');
            await submitForm();

            await waitFor(() => {
                expect(mockSignIn).toHaveBeenCalledWith('test@mail.com', 'Password_123!');
                expect(addToast).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('should display error on sign in failure', async (): Promise<void> => {
            mockSignIn.mockRejectedValue(new Error('fail'));
            const { user } = renderSignIn();

            await user.type(screen.getAllByPlaceholderText('exemple@email.com')[0], 'test@mail.com');
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], 'Password_123!');
            await submitForm();

            await waitFor(() => {
                expect(screen.getByText('La connexion a échoué : identifiants de connexion incorrects')).toBeInTheDocument();
            });

            expect(mockNavigate).not.toHaveBeenCalled();
        });

    });

});
