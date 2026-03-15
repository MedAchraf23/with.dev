import { createContext, useState, useEffect, ReactNode } from 'react'
import { AuthContextType, AuthState } from '@/features/authentification/interfaces/auth.type.ts'
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import AuthService from '@/features/authentification/services/auth.service'

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }): ReactNode {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
    })

    useEffect(() => {
        AuthService.getSession()
            .then((session: Session|null): void => {
                setState({ user: session?.user ?? null, session, loading: false })
            })
            .catch((error: unknown): void => {
                console.error('Failed to get session:', error);
                setState({ user: null, session: null, loading: false });
            });

        const subscription = AuthService.onAuthStateChange((_event: AuthChangeEvent, session: Session|null) => {
            setState({ user: session?.user ?? null, session, loading: false })
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string): Promise<void> => {
        await AuthService.signIn(email, password);
    }

    const signUp = async (email: string, password: string): Promise<void> => {
        await AuthService.signUp(email, password);
    }

    const signOut = async (): Promise<void> => {
        await AuthService.signOut();
    }

    return (
        <AuthContext.Provider value={{ ...state, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
