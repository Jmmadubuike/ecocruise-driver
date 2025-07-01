// /middleware.js
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
  const token = req.cookies.get('token')?.value;

  // Define URLs for redirection and public routes
  const loginUrl = new URL('/login', req.url);

  // Public routes where no auth check should run
  const publicPaths = ['/login', '/driver/login'];

  // Allow unauthenticated access to public routes to avoid redirect loops
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If no token present, redirect to generic login page
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  // Verify token and extract payload
  const decoded = await verifyJWT(token);

  // If token invalid or role is not 'driver', redirect to login
  if (!decoded || decoded.role !== 'driver') {
    return NextResponse.redirect(loginUrl);
  }

  // All checks passed, continue with request
  return NextResponse.next();
}

export const config = {
  matcher: ['/driver/:path*'], // Only apply middleware to /driver/* routes
};
