import { NextResponse } from 'next/server';

export function middleware(request) {
  const { nextUrl, cookies } = request;
  
  // Check for the presence of the authentication token cookie
  const isAuthenticated = !!cookies.get('auth_token');
  const path = nextUrl.pathname;

  // 1. RESTRICT LOGIN/GUEST PAGES
  // If authenticated, bounce users away from the login page to the dashboard
  if (path === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Optional: If they hit root '/', cleanly forward them to '/login'
    // if (path === '/') {
    //   return NextResponse.redirect(new URL('/', request.url));
    // }
  }

  // 2. RESTRICT PROTECTED PORTAL PAGES
  // If NOT authenticated, block entry to the dashboard and send them to login
  if (path.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// 3. MATCH PATTERNS
// Optimize performance by only executing the middleware on specific routing paths
export const config = {
  matcher: ['/', '/dashboard'],
};