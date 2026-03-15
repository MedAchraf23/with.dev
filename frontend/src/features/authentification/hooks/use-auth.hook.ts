import { useContext } from 'react'
import { AuthContextType } from '@/features/authentification/interfaces/auth.type.ts'
import { AuthContext } from "@/features/authentification/contexts/AuthContext.tsx";

/**
 * @function useAuth
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un <AuthProvider>');
    }
    return context;
}