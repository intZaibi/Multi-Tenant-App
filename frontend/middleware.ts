import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  
  const publicRoutes = ['/auth', '/login', '/register', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // If accessing a protected route without any tokens, redirect to auth
//   if (isProtectedRoute && (!accessToken || !refreshToken)) {
//   if (subdomain) {
//     NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url));
//   }
//   const response = NextResponse.redirect(new URL('/auth', request.url));
//   return response;
// }

  
  if (pathname === '/auth' && (accessToken || refreshToken)) {
    if (subdomain) {
      const dashboardUrl = new URL(`/s/${subdomain}/dashboard`, request.url);
      const response = NextResponse.rewrite(dashboardUrl);
      return response;
    }else{
      const dashboardUrl = new URL('/dashboard', request.url);
      const response = NextResponse.redirect(dashboardUrl);
      return response;
    }
  }
  
  // If accessing root path with tokens, redirect to dashboard
  if (pathname === '/' && (accessToken || refreshToken)) {
    if (subdomain) {
      const dashboardUrl = new URL(`/s/${subdomain}/dashboard`, request.url);
      const response = NextResponse.rewrite(dashboardUrl);
      return response;
    }else{
      const dashboardUrl = new URL('/dashboard', request.url);
      const response = NextResponse.redirect(dashboardUrl);
      return response;
    }
  }
  
  // If accessing root path without tokens, redirect to auth
  if (pathname === '/' && !accessToken && !refreshToken) {
    if (subdomain) {
      const authUrl = new URL(`/s/${subdomain}/auth`, request.url);
      const response = NextResponse.rewrite(authUrl);
      return response;
    }else{
      const authUrl = new URL('/auth', request.url);
      const response = NextResponse.redirect(authUrl);
      return response;
    }
  }
  
  return NextResponse.next(); 
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
