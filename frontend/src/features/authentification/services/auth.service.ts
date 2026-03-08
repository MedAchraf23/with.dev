import {supabase} from "@/infrastructure/api/supabase.api.ts";
import {Session} from "@supabase/supabase-js";

/**
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
const AuthService = {

    async getSession(): Promise<Session | null> {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            throw error;
        }
        return session;
    },

    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => callback(event, session)
        );
        return subscription;
    },

    async signUp(email: string, password: string): Promise<void> {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            throw error;
        }
    },

    async signIn(email: string, password: string): Promise<void> {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            throw error;
        }
    },

    async signInWithGoogle(): Promise<void> {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) throw error;
    },

    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
    },

};

export default AuthService;