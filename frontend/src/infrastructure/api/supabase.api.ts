import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Variables d'environnement manquantes : VITE_SUPABASE_URL et/ou VITE_SUPABASE_ANON_KEY"
    );
}

/**
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
