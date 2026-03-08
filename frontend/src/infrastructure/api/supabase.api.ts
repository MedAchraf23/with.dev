import { createClient } from '@supabase/supabase-js'

/**
 * @author Arthur MATHIS <arthur.mathis@uha.fr>
 */
export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);
