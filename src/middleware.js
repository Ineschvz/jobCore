import { updateSession } from '../utils/supabase/middleware'

export async function middleware(request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Run middleware on all routes except static files and api
    '/((?!_next/static|_next/image|favicon.ico|api/ping|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
