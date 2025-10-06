import { auth } from './auth';
import { NextResponse } from 'next/server';
import { PUBLIC_ROUTES, LOGIN, ROOT } from '@/lib/routes';

export default auth((req) => {
	const { nextUrl } = req;
	const isAuthenticated = !!req.auth;

	const isPublicRoute =
		PUBLIC_ROUTES.some((route) => nextUrl.pathname.startsWith(route)) ||
		nextUrl.pathname === ROOT;

	if (!isAuthenticated && !isPublicRoute) {
		return NextResponse.redirect(new URL(LOGIN, nextUrl));
	}
	return NextResponse.next();
});

export const config = {
	matcher: ['/((?!api/auth|_next|favicon.ico|.*\\..*).*)', '/'],
};
