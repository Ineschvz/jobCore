import {createBrowserClient} from '@supabase/ssr'

export function createClient () {
    return createBrowserCient (
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_ANON_KEY,
    )
}
