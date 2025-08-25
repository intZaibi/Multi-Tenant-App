import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getServerUser } from './services/auth';

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  const user = await getServerUser();
  
  if (!user && subdomain && !pathname.includes('/auth')) {
    console.log(`Middleware: No user found, redirecting to /s/${subdomain}/auth`);
    return NextResponse.rewrite(new URL(`/s/${subdomain}/auth`, request.url));
  } else if(!user && pathname !== '/auth'){
    console.log('Middleware: No user found, redirecting to /auth');
    return NextResponse.redirect(new URL(`/auth`, request.url));
  }

  if(!subdomain && pathname === '/'){
    console.log("redirecting to dashboard");
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  if (subdomain && pathname === '/') {
    console.log("redirecting to subdomain dashboard");
    return NextResponse.rewrite(new URL(`/s/${subdomain}/dashboard`, request.url));
  }

  if(subdomain){
    console.log('redirecting to subdomain path')
    return NextResponse.rewrite(new URL(`/s/${subdomain}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
