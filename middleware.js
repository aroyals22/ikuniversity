import { NextResponse } from 'next/server';
import { PUBLIC_ROUTES, LOGIN, ROOT } from '@/lib/routes';

export async function middleware(req) {
	const { nextUrl } = req;

	// Check if route is public
	const isPublicRoute =
		PUBLIC_ROUTES.some((route) => nextUrl.pathname.startsWith(route)) ||
		nextUrl.pathname === ROOT ||
		nextUrl.pathname.startsWith('/api/auth');

	// Let public routes through
	if (isPublicRoute) {
		return NextResponse.next();
	}

	// Check for session token
	const token =
		req.cookies.get('authjs.session-token') ||
		req.cookies.get('__Secure-authjs.session-token');

	if (!token) {
		return NextResponse.redirect(new URL(LOGIN, nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next|favicon.ico|.*\\..*).*)', '/'],
};
