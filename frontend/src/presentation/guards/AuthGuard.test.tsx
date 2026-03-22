import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthGuard from "@/presentation/guards/AuthGuard.tsx";
import { AuthContextType } from "@/features/authentification/interfaces/auth.type.ts";

vi.mock('@/features/authentification/hooks/use-auth.hook.ts');
import { useAuth } from '@/features/authentification/hooks/use-auth.hook.ts';

describe('AuthGuard - Unit', (): void => {

    afterEach((): void => {
        cleanup();
        vi.clearAllMocks();
    });

    it('should begin with a loading state', (): void => {
        vi.mocked(useAuth).mockReturnValue({ session: null, loading: true } as AuthContextType);

        render(
            <MemoryRouter>
                <AuthGuard />
            </MemoryRouter>
        );

        expect(screen.getByTestId('loading-spinner'))
            .toBeInTheDocument();
    });

    it('should redirect to /auth when no session', (): void => {
        vi.mocked(useAuth).mockReturnValue({ session: null, loading: false } as AuthContextType);

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/auth" element={<div>Page Auth</div>} />
                    <Route path="/protected" element={<AuthGuard />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Page Auth'))
            .toBeInTheDocument();
    });

    it('should render children when session exists', (): void => {
        vi.mocked(useAuth).mockReturnValue({ session: { id: '1' }, loading: false } as unknown as AuthContextType);

        render(
            <MemoryRouter>
                <Routes>
                    <Route element={<AuthGuard />}>
                        <Route index element={<div>Contenu protégé</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Contenu protégé'))
            .toBeInTheDocument();
    });

});