import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthPage } from '@/presentation/pages/Authentification/AuthPage.tsx';

vi.mock('@/features/authentification/components/SignIn.tsx', () => ({
    default: () => <div>SignIn Form</div>,
}));

vi.mock('@/features/authentification/components/SignUp.tsx', () => ({
    default: () => <div>SignUp Form</div>,
}));

describe('Authentification/AuthPage - Integration', (): void => {

    afterEach((): void => cleanup());

    it('should display SignIn form by default', (): void => {
        render(
            <MemoryRouter>
                <AuthPage />
            </MemoryRouter>
        );

        expect(screen.getByText('SignIn Form'))
            .toBeInTheDocument();
    });

    it('should switch to SignUp form when clicking on S\'inscrire tab', async (): Promise<void> => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <AuthPage />
            </MemoryRouter>
        );

        await user.click(screen.getByText("S'inscrire"));

        expect(screen.getByText('SignUp Form'))
            .toBeInTheDocument();
    });

});
