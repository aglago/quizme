// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }) as JWT | null;
  
  // Check if the path is protected
  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard') || 
                         request.nextUrl.pathname.startsWith('/api') && 
                         !request.nextUrl.pathname.startsWith('/api/auth');
  
  // Redirect to login if accessing protected route without being authenticated
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if authenticated user tries to access login/register
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/login',
    '/register',
  ],
};