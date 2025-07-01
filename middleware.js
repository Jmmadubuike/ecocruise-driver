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

  // Public routes that do not require auth
  const publicPaths = ['/login', '/driver/login', '/api'];

  // Skip auth for public routes & API routes
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // No token - redirect to login
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  // Verify JWT
  const decoded = await verifyJWT(token);

  // Redirect if invalid token or wrong role
  if (!decoded || decoded.role !== 'driver') {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/driver/:path*'],
};
