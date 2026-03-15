import { Session, User } from '@supabase/supabase-js'

/**@interface AuthState
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export interface AuthState {
    user: User | null
    session: Session | null
    loading: boolean
}

/**
 * @interface AuthContextType
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export interface AuthContextType extends AuthState {
    signUp: (email: string, password: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
}
