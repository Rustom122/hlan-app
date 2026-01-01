
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

// Retaining the singleton for legacy/compatibility if needed, 
// but recommended to call createClient() in components.
// For now, let's export a singleton 'supabase' for the existing code's sake,
// BUT for @supabase/ssr, it's better to create a new one to handle dynamic cookies properly if needed.
// However, 'createBrowserClient' is for client-side and is singleton-friendly.
export const supabase = createClient();
