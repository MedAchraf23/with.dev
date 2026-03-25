import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import userEvent from "@testing-library/user-event/dist/cjs/index.js";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import SignUp from "@/features/authentification/components/SignUp.tsx";

const mockSignUp = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});


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

describe('SignUP Component - Unit', (): void => {

    beforeEach((): void => {
        vi.clearAllMocks();
        mockSignUp.mockResolvedValue(undefined);
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

    it('should sign up and navigate on success', async (): Promise<void> => {
        const { user } = renderSignUp();

        await user.type(screen.getByPlaceholderText('exemple@email.com'), 'test@mail.com');
        await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], 'Password_123!');
        await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[1], 'Password_123!');
        await submitForm();

        await waitFor(() => {
            expect(mockSignUp).toHaveBeenCalledWith('test@mail.com', 'Password_123!');
            expect(mockNavigate).toHaveBeenCalledWith('/auth/confirm-email', {
                state: { email: 'test@mail.com' },
                replace: true,
            });
        });
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
                expect(screen.getByText('Mot de passe requis')).toBeInTheDocument();
            });
        });

        it('should show password too short error', async (): Promise<void> => {
            const { user } = renderSignUp();

            await user.type(screen.getByPlaceholderText('exemple@email.com'), 'test@mail.com');
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[0], '123'); // Password too short
            await user.type(screen.getAllByPlaceholderText('Votre mot de passe')[1], '123'); // Password too short

            await waitFor(() => {
                expect(screen.getByText('12 caractères minimum')).toBeInTheDocument();
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