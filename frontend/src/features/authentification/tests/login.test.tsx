import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login';

const mockSignIn = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/features/authentification/hooks/use-auth.hook.ts', () => ({
    useAuth: () => ({ signIn: mockSignIn }),
}));

vi.mock('@/features/authentification/hooks/use-google-auth.hook.ts', () => ({
    useGoogleAuth: () => ({ signInWithGoogle: mockSignInWithGoogle, loading: false }),
}));

vi.mock('@heroui/toast', () => ({
    addToast: vi.fn(),
}));

const renderLogin = () => {
    const user = userEvent.setup();
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );
    return { user };
};

const submitForm = async () => {
    const button = screen.getByRole('button', { name: 'Se connecter' });
    await userEvent.click(button);
};

describe('Login Component - Unit', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render the form', () => {
        renderLogin();

        expect(screen.getAllByPlaceholderText('exemple@email.com')[0]).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText('Votre mot de passe')[0]).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });

    describe('valid field', () => {

        it('should show email required error on submit', async () => {
            const { user } = renderLogin();

            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], 'password123');
            submitForm();

            await waitFor(() => {
                expect(screen.getByText('Email requis')).toBeInTheDocument();
            });
        });

        it('should show invalid email error', async () => {
            const { user } = renderLogin();

            const emailInput = screen.getAllByPlaceholderText('exemple@email.com')[0];
            await user.type(emailInput, 'invalid');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText('Email invalide')).toBeInTheDocument();
            });
        });

        it('should show password required error on submit', async () => {
            const { user } = renderLogin();

            await user.type(screen.getAllByPlaceholderText('exemple@email.com')[0], 'test@mail.com');
            submitForm();

            await waitFor(() => {
                expect(screen.getByText('Mot de passe requis')).toBeInTheDocument();
            });
        });

        it('should show password too short error', async () => {
            const { user } = renderLogin();

            const passwordInput = screen.getAllByPlaceholderText('Votre mot de passe')[0];
            await user.type(passwordInput, '123');

            await waitFor(() => {
                expect(screen.getByText('8 caractères minimum')).toBeInTheDocument();
            });
        });

    });

    describe('email authentification', () => {

        it('should sign in and navigate on success', async () => {
            mockSignIn.mockResolvedValue(undefined);
            const { addToast } = await import('@heroui/toast');
            const { user } = renderLogin();

            await user.type(screen.getAllByPlaceholderText('exemple@email.com')[0], 'test@mail.com');
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], 'password123');
            submitForm();

            await waitFor(() => {
                expect(mockSignIn).toHaveBeenCalledWith('test@mail.com', 'password123');
                expect(addToast).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
            });
        });

        it('should display error on sign in failure', async () => {
            mockSignIn.mockRejectedValue(new Error('fail'));
            const { user } = renderLogin();

            await user.type(screen.getAllByPlaceholderText('exemple@email.com')[0], 'test@mail.com');
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], 'password123');
            submitForm();

            await waitFor(() => {
                expect(screen.getByText('Erreur de connexion')).toBeInTheDocument();
            });

            expect(mockNavigate).not.toHaveBeenCalled();
        });

    });

    describe('google authentification', () => {

        it('should call signInWithGoogle on Google button click', async () => {
            const { user } = renderLogin();

            await user.click(screen.getByRole('button', { name: /google/i }));

            expect(mockSignInWithGoogle).toHaveBeenCalled();
        });

    });

});
