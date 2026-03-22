import {describe, it, expect, afterEach} from 'vitest'
import {cleanup, render, screen} from '@testing-library/react'
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ConfirmEmailPage from "@/presentation/pages/Authentification/ConfirmEmailPage.tsx";

describe('Authentification/ConfirmEmail - Integration', (): void => {

    afterEach((): void => {
        cleanup();
    });

    it('should redirect to /auth when no email in state', async (): Promise<void> => {
        render(
            <MemoryRouter initialEntries={['/confirm-email']}>
                <Routes>
                    <Route path="/confirm-email" element={<ConfirmEmailPage />} />
                    <Route path="/auth" element={<div>Auth page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText('Auth page'))
            .toBeInTheDocument();
    });

    it('should display email when present in state', (): void => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/confirm-email', state: { email: 'test@test.com' } }]}>
                <Routes>
                    <Route path="/confirm-email" element={<ConfirmEmailPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('test@test.com'))
            .toBeInTheDocument();
    });


});