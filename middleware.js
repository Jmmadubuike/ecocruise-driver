import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyJWT(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.warn('JWT verification failed:', err.message);
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  const loginUrl = new URL('/login', req.url);

  console.log('MIDDLEWARE: checking path:', pathname);
  console.log('MIDDLEWARE: cookies:', req.cookies.getAll());
  console.log('MIDDLEWARE: token:', token);

  // Public paths that do not require authentication
  const publicPaths = ['/login', '/driver/login', '/api'];

  // Allow access to public paths without checks
  if (publicPaths.some(path => pathname.startsWith(path))) {
    console.log('MIDDLEWARE: public path, proceeding.');
    return NextResponse.next();
  }

  // No token - redirect
  if (!token) {
    console.log('MIDDLEWARE: no token, redirecting to login.');
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const decoded = await verifyJWT(token);

  // Invalid or wrong role - redirect
  if (!decoded || decoded.role !== 'driver') {
    console.log('MIDDLEWARE: invalid or unauthorized role, redirecting to login.');
    return NextResponse.redirect(loginUrl);
  }

  console.log('MIDDLEWARE: verified, user:', decoded);
  return NextResponse.next();
}

// Adjust matcher to protect driver routes now, and easily extend later
export const config = {
  matcher: ['/driver/:path*'],
};
