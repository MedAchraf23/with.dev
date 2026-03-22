import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event/dist/cjs/index.js";
import ExternalAuthentification from "@/features/authentification/components/ExternalAuthentification.tsx";

const mockSignInWithGoogle = vi.fn();

vi.mock('@/features/authentification/hooks/use-google-auth.hook.ts', () => ({
    useGoogleAuth: () => ({ signInWithGoogle: mockSignInWithGoogle, loading: false }),
}));

const renderExternalAuthentification = () => {
    const user = userEvent.setup();
    render(
        <MemoryRouter>
            <ExternalAuthentification />
        </MemoryRouter>
    );
    return { user };
};

describe('ExternalAuthentification Component - Unit', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    describe('google authentification', () => {

        it('should call signInWithGoogle on Google button click', async () => {
            const { user } = renderExternalAuthentification();

            await user.click(screen.getByRole('button', { name: /google/i }));

            expect(mockSignInWithGoogle).toHaveBeenCalled();
        });

    });

});