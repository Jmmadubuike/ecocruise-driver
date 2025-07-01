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
  const loginUrl = new URL('/login', req.url);

  // Skip loop
  if (req.nextUrl.pathname === '/login') {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const decoded = await verifyJWT(token);

  if (!decoded || decoded.role !== 'driver') {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/driver/:path*'],
};
