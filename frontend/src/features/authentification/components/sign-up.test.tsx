import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import userEvent from "@testing-library/user-event/dist/cjs/index.js";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import SignUp from "@/features/authentification/components/SignUp.tsx";

const mockSignUp = vi.fn();

vi.mock('@/features/authentification/hooks/use-auth.hook.ts', () => ({
    useAuth: () => ({ signUp: mockSignUp }),
}));

const renderSignUp = () => {
    const user = userEvent.setup();
    render(
        <MemoryRouter>
            <SignUp />
        </MemoryRouter>
    );
    return { user };
};

const submitForm = async (): Promise<void> => {
    const button = screen.getByRole('button', { name: 'S\'inscrire' });
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
        renderSignUp();

        expect(screen.getByPlaceholderText('exemple@email.com')).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText('Votre mot de passe')[0]).toBeInTheDocument();
        expect(screen.getAllByPlaceholderText('Votre mot de passe')[1]).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
    });

    describe('email field', (): void => {

        it('should show email required error on submit', async (): Promise<void> => {
            renderSignUp();

            await submitForm();

            await waitFor(() => {
                expect(screen.getByText('Email requis')).toBeInTheDocument();
            });
        });

        it('should show invalid email error', async (): Promise<void> => {
            const { user } = renderSignUp();

            await user.type(screen.getByPlaceholderText('exemple@email.com'), 'invalid');
            await user.tab();

            await waitFor(() => {
                expect(screen.getByText('Email invalide')).toBeInTheDocument();
            });
        });

    });

    describe('password field', (): void => {

        it('should show password required error on submit', async (): Promise<void> => {
            const { user } = renderSignUp();

            await user.type(screen.getByPlaceholderText('exemple@email.com'), 'test@mail.com');
            await submitForm();

            await waitFor(() => {
                const errorMessages = screen.getAllByText('Mot de passe requis');
                expect(errorMessages).toHaveLength(2);
            });
        });

        it('should show password too short error', async (): Promise<void> => {
            const { user } = renderSignUp();

            await user.type(screen.getByPlaceholderText('exemple@email.com'), 'test@mail.com');
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], '123'); // Password too short
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[1], '123'); // Password too short

            await waitFor(() => {
                const errorMessages = screen.getAllByText('12 caractères minimum')
                expect(errorMessages).toHaveLength(2);
            });
        });

        it('should show different password error', async (): Promise<void> => {
            const { user } = renderSignUp();

            await user.type(screen.getByPlaceholderText('exemple@email.com'), 'test@mail.com');
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], 'Password_123!');
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[1], 'Password_124!'); // Wrong password

            await waitFor(() => {
                expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
            });
        });

    });

});