import { createContext, useState, useEffect, ReactNode } from 'react'
import { AuthContextType, AuthState } from '@/features/authentification/interfaces/auth.type.ts'
import AuthService from '@/features/authentification/services/auth.service'

/**
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
    })

    useEffect(() => {
        AuthService.getSession().then((session) => {
            setState({ user: session?.user ?? null, session, loading: false })
        });

        const subscription = AuthService.onAuthStateChange((session) => {
            setState({ user: session?.user ?? null, session, loading: false })
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string) => {
        await AuthService.signUp(email, password);
    }

    const signIn = async (email: string, password: string) => {
        await AuthService.signIn(email, password);
    }

    const signOut = async () => {
        await AuthService.signOut();
    }

    return (
        <AuthContext.Provider value={{ ...state, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
